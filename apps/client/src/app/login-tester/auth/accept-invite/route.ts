import { type NextRequest, NextResponse } from "next/server";

import { createClientForOAuthResponse } from "@/lib/supabase/server";

export const runtime = "nodejs";

function safeNext(raw: string | null): string {
	if (!raw?.startsWith("/") || raw.startsWith("//")) {
		return "/set-password";
	}
	return raw;
}

export async function GET(request: NextRequest) {
	const url = request.nextUrl;
	const tokenHash = url.searchParams.get("token_hash");
	const type = url.searchParams.get("type");

	if (!tokenHash || type !== "invite") {
		return NextResponse.redirect(
			new URL("/login-tester?error=invalid_link", request.url),
		);
	}

	const next = safeNext(url.searchParams.get("next"));
	const redirectTarget = new URL(next, request.url);
	const response = NextResponse.redirect(redirectTarget);

	const supabase = createClientForOAuthResponse(request, response);
	const { error } = await supabase.auth.verifyOtp({
		token_hash: tokenHash,
		type: "invite",
	});

	if (error) {
		console.error("[login-tester/accept-invite] verifyOtp:", error.message);
		return NextResponse.redirect(
			new URL("/login-tester?error=invite_expired", request.url),
		);
	}

	return response;
}
