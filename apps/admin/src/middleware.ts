import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function copyCookies(from: NextResponse, to: NextResponse) {
	const setCookies = from.headers.getSetCookie?.() ?? [];
	if (setCookies.length > 0) {
		for (const cookie of setCookies) {
			to.headers.append("Set-Cookie", cookie);
		}
	} else {
		for (const cookie of from.cookies.getAll()) {
			to.cookies.set(cookie.name, cookie.value);
		}
	}
}

function isPublicPath(pathname: string): boolean {
	if (pathname === "/login" || pathname.startsWith("/login/")) return true;
	if (pathname === "/auth" || pathname.startsWith("/auth/")) return true;
	if (pathname === "/api/auth" || pathname.startsWith("/api/auth/"))
		return true;
	if (pathname === "/") return true;
	return false;
}

function isAdminRole(user: {
	app_metadata?: unknown;
	user_metadata?: unknown;
}) {
	const appRole =
		typeof user.app_metadata === "object" && user.app_metadata
			? (user.app_metadata as Record<string, unknown>).role
			: null;
	const userRole =
		typeof user.user_metadata === "object" && user.user_metadata
			? (user.user_metadata as Record<string, unknown>).role
			: null;

	return appRole === "admin" || userRole === "admin";
}

export async function middleware(request: NextRequest) {
	const { response, user } = await updateSession(request);
	const url = request.nextUrl;
	const isApiPath = url.pathname === "/api" || url.pathname.startsWith("/api/");
	const isPublic = isPublicPath(url.pathname);

	if (!user) {
		if (isPublic) return response;
		if (isApiPath) {
			const unauthorized = NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
			copyCookies(response, unauthorized);
			return unauthorized;
		}
		const loginUrl = new URL("/login", request.url);
		const returnPath = `${url.pathname}${url.search}`;
		if (returnPath !== "/login") {
			loginUrl.searchParams.set("next", returnPath);
		}
		const redirect = NextResponse.redirect(loginUrl);
		copyCookies(response, redirect);
		return redirect;
	}

	if (!isAdminRole(user)) {
		if (isPublic) {
			return response;
		}
		if (isApiPath) {
			const forbidden = NextResponse.json(
				{ error: "Admin access required" },
				{ status: 403 },
			);
			copyCookies(response, forbidden);
			return forbidden;
		}
		const redirect = NextResponse.redirect(
			new URL("/login?error=forbidden", request.url),
		);
		copyCookies(response, redirect);
		return redirect;
	}

	if (url.pathname.startsWith("/login") || url.pathname === "/") {
		const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
		copyCookies(response, redirect);
		return redirect;
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
