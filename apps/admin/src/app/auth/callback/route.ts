import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(rawNext: string | null): string {
	if (!rawNext) return "/set-password";
	if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
		return "/set-password";
	}
	return rawNext;
}

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
	const redirectUrl = new URL(nextPath, request.url);

	if (!code) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("error", "auth_unavailable");
		return NextResponse.redirect(loginUrl);
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.exchangeCodeForSession(code);
	if (error) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("error", "auth_unavailable");
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.redirect(redirectUrl);
}
