import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RequestOtpBody = {
	email?: string;
};

function normalizeEmail(email: string | undefined): string | null {
	const value = email?.trim().toLowerCase();
	if (!value) return null;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
	return value;
}

export async function POST(request: Request) {
	let body: RequestOtpBody;
	try {
		body = (await request.json()) as RequestOtpBody;
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
		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: false,
			},
		});

		if (error) {
			const authError = error as Error & { status?: number };
			// Return generic success for non-existing account to avoid enumeration.
			if (authError.status === 422) {
				return NextResponse.json({
					ok: true,
					message: "If your admin account exists, we sent a one-time code.",
				});
			}
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
			return NextResponse.json(
				{
					ok: false,
					code: "SEND_FAILED",
					message: "Unable to send one-time code right now.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json({
			ok: true,
			message: "If your admin account exists, we sent a one-time code.",
		});
	} catch (error) {
		console.error("[admin auth request-otp]", error);
		return NextResponse.json(
			{
				ok: false,
				code: "SEND_FAILED",
				message: "Unable to send one-time code right now.",
			},
			{ status: 500 },
		);
	}
}
