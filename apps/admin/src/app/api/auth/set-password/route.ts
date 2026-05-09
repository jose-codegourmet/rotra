import { activateAdminIfNeeded, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SetPasswordBody = {
	password?: string;
};

function normalizePassword(password: string | undefined): string | null {
	const value = password?.trim();
	if (!value) return null;
	if (value.length < 8) return null;
	return value;
}

export async function POST(request: Request) {
	let body: SetPasswordBody;
	try {
		body = (await request.json()) as SetPasswordBody;
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const password = normalizePassword(body.password);
	if (!password) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_PASSWORD",
				message: "Password must be at least 8 characters.",
			},
			{ status: 400 },
		);
	}

	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();
		if (userError || !user) {
			return NextResponse.json(
				{
					ok: false,
					code: "UNAUTHORIZED",
					message: "Session expired. Please sign in again.",
				},
				{ status: 401 },
			);
		}

		const { error } = await supabase.auth.updateUser({ password });
		if (error) {
			const authError = error as Error & { status?: number };
			if (authError.status === 429) {
				return NextResponse.json(
					{
						ok: false,
						code: "RATE_LIMITED",
						message: "Too many attempts. Please wait before retrying.",
					},
					{ status: 429 },
				);
			}
			return NextResponse.json(
				{
					ok: false,
					code: "SET_PASSWORD_FAILED",
					message: "Unable to set password right now.",
				},
				{ status: 500 },
			);
		}

		await activateAdminIfNeeded(db, { userId: user.id, email: user.email });

		return NextResponse.json({
			ok: true,
			message: "Password set successfully.",
		});
	} catch (error) {
		console.error("[admin auth set-password]", error);
		return NextResponse.json(
			{
				ok: false,
				code: "SET_PASSWORD_FAILED",
				message: "Unable to set password right now.",
			},
			{ status: 500 },
		);
	}
}
