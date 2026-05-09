import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_OTP_TYPES = new Set<EmailOtpType>([
	"recovery",
	"invite",
	"signup",
	"magiclink",
	"email",
	"email_change",
]);

function getSafeNextPath(rawNext: string | null): string {
	if (!rawNext) return "/set-password";
	if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
		return "/set-password";
	}
	return rawNext;
}

function loginAuthUnavailable(request: Request) {
	return NextResponse.redirect(
		new URL("/login?error=auth_unavailable", request.url),
	);
}

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const tokenHash = requestUrl.searchParams.get("token_hash");
	const rawType = requestUrl.searchParams.get("type") as EmailOtpType | null;
	const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
	const redirectUrl = new URL(nextPath, request.url);

	const supabase = await createClient();

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			return loginAuthUnavailable(request);
		}
		return NextResponse.redirect(redirectUrl);
	}

	if (tokenHash && rawType && ALLOWED_OTP_TYPES.has(rawType)) {
		const { error } = await supabase.auth.verifyOtp({
			type: rawType,
			token_hash: tokenHash,
		});
		if (error) {
			console.error("[admin auth callback] verifyOtp failed", error);
			return loginAuthUnavailable(request);
		}
		return NextResponse.redirect(redirectUrl);
	}

	return loginAuthUnavailable(request);
}
