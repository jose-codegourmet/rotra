import { activateAdminIfNeeded, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SignInBody = {
	email?: string;
	password?: string;
};

function normalizeEmail(email: string | undefined): string | null {
	const value = email?.trim().toLowerCase();
	if (!value) return null;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
	return value;
}

function normalizePassword(password: string | undefined): string | null {
	const value = password?.trim();
	if (!value) return null;
	return value;
}

export async function POST(request: Request) {
	let body: SignInBody;
	try {
		body = (await request.json()) as SignInBody;
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const email = normalizeEmail(body.email);
	const password = normalizePassword(body.password);
	if (!email || !password) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_INPUT",
				message: "Enter a valid email and password.",
			},
			{ status: 400 },
		);
	}

	try {
		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
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
			if (
				authError.status === 400 ||
				authError.status === 401 ||
				authError.status === 422
			) {
				return NextResponse.json(
					{
						ok: false,
						code: "INVALID_CREDENTIALS",
						message: "Incorrect email or password.",
					},
					{ status: 401 },
				);
			}
			return NextResponse.json(
				{
					ok: false,
					code: "SIGNIN_FAILED",
					message: "Unable to sign in right now.",
				},
				{ status: 500 },
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user?.id) {
			await activateAdminIfNeeded(db, { userId: user.id, email: user.email });
		}

		return NextResponse.json({
			ok: true,
			message: "Signed in successfully.",
		});
	} catch (error) {
		console.error("[admin auth sign-in]", error);
		return NextResponse.json(
			{
				ok: false,
				code: "SIGNIN_FAILED",
				message: "Unable to sign in right now.",
			},
			{ status: 500 },
		);
	}
}
