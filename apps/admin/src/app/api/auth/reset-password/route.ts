import { NextResponse } from "next/server";
import { sendAdminPasswordResetLink } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ResetPasswordBody = {
	email?: string;
};

function normalizeEmail(email: string | undefined): string | null {
	const value = email?.trim().toLowerCase();
	if (!value) return null;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
	return value;
}

export async function POST(request: Request) {
	let body: ResetPasswordBody;
	try {
		body = (await request.json()) as ResetPasswordBody;
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const email = normalizeEmail(body.email);
	if (!email) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_EMAIL",
				message: "Enter a valid email address.",
			},
			{ status: 400 },
		);
	}

	try {
		const callbackUrl = new URL(
			"/auth/callback?next=/set-password",
			request.url,
		);
		await sendAdminPasswordResetLink(email, callbackUrl.toString());
		return NextResponse.json({
			ok: true,
			message: "If your admin account exists, we sent a password reset link.",
		});
	} catch (error) {
		const authError = error as Error & { status?: number };
		if (authError.status === 429) {
			return NextResponse.json(
				{
					ok: false,
					code: "RATE_LIMITED",
					message: "Too many requests. Please wait before trying again.",
				},
				{ status: 429 },
			);
		}
		console.error("[admin auth reset-password]", error);
		return NextResponse.json(
			{
				ok: false,
				code: "RESET_FAILED",
				message: "Unable to send password reset link right now.",
			},
			{ status: 500 },
		);
	}
}
