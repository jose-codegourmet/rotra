import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { createClient } from "@/lib/supabase/server";
import { adminUserErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

const changePasswordSchema = z.object({
	password: z.string().trim().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const parsed = changePasswordSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_PASSWORD",
				message:
					parsed.error.issues[0]?.message ??
					"Password must be at least 8 characters.",
			},
			{ status: 400 },
		);
	}

	try {
		await requireAdminSession();
		const supabase = await createClient();
		const { error } = await supabase.auth.updateUser({
			password: parsed.data.password,
		});
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
					code: "CHANGE_PASSWORD_FAILED",
					message: "Unable to change password right now.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json({
			ok: true,
			message: "Password updated successfully.",
		});
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users me change-password]");
	}
}
