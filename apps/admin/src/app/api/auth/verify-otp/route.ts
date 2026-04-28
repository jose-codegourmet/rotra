import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type VerifyOtpBody = {
	email?: string;
	token?: string;
};

function normalizeEmail(email: string | undefined): string | null {
	const value = email?.trim().toLowerCase();
	if (!value) return null;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
	return value;
}

function normalizeToken(token: string | undefined): string | null {
	const value = token?.trim();
	if (!value) return null;
	if (!/^\d{6}$/.test(value)) return null;
	return value;
}

export async function POST(request: Request) {
	let body: VerifyOtpBody;
	try {
		body = (await request.json()) as VerifyOtpBody;
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const email = normalizeEmail(body.email);
	const token = normalizeToken(body.token);
	if (!email || !token) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_INPUT",
				message: "Enter a valid email and 6-digit one-time code.",
			},
			{ status: 400 },
		);
	}

	try {
		const supabase = await createClient();
		const { error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: "email",
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
						code: "INVALID_OTP",
						message: "Invalid or expired one-time code.",
					},
					{ status: 400 },
				);
			}
			return NextResponse.json(
				{
					ok: false,
					code: "VERIFY_FAILED",
					message: "Unable to verify code right now.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json({
			ok: true,
			message: "Signed in successfully.",
		});
	} catch (error) {
		console.error("[admin auth verify-otp]", error);
		return NextResponse.json(
			{
				ok: false,
				code: "VERIFY_FAILED",
				message: "Unable to verify code right now.",
			},
			{ status: 500 },
		);
	}
}
