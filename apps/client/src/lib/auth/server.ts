import { createHash, timingSafeEqual } from "node:crypto";
import { db } from "@rotra/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	normalizeEmail,
	normalizePassword,
} from "@/lib/helpers/auth-input-normalizers";
import { createClient } from "@/lib/supabase/server";

export const CLIENT_ADMIN_LOGIN_GATE_COOKIE = "client_admin_login_gate";
export const CLIENT_ADMIN_LOGIN_GATE_COOKIE_VALUE = "ok";

type AdminGateBody = {
	password?: string;
};

type AdminSignInBody = {
	email?: string;
	password?: string;
};

function timingSafeCompareGatePassword(input: string, secret: string): boolean {
	const a = createHash("sha256").update(input, "utf8").digest();
	const b = createHash("sha256").update(secret, "utf8").digest();
	return timingSafeEqual(a, b);
}

export function getClientAdminGateCookieOptions(): {
	httpOnly: boolean;
	maxAge: number;
	sameSite: "lax";
	secure: boolean;
	path: string;
} {
	return {
		httpOnly: true,
		maxAge: 60 * 30,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
	};
}

function clearGateOnResponse(res: NextResponse) {
	res.cookies.set(CLIENT_ADMIN_LOGIN_GATE_COOKIE, "", {
		...getClientAdminGateCookieOptions(),
		maxAge: 0,
	});
}

export async function handleClientAdminGate(request: Request) {
	const secret = process.env.CLIENT_ADMIN_LOGIN_GATE_PASSWORD?.trim();
	if (!secret) {
		return NextResponse.json(
			{
				ok: false,
				code: "GATE_UNAVAILABLE",
				message: "Admin login gate is not configured.",
			},
			{ status: 503 },
		);
	}

	let body: AdminGateBody;
	try {
		body = (await request.json()) as AdminGateBody;
	} catch {
		return NextResponse.json(
			{ ok: false, code: "INVALID_BODY", message: "Invalid request body." },
			{ status: 400 },
		);
	}

	const password = body.password ?? "";
	if (!timingSafeCompareGatePassword(password, secret)) {
		return NextResponse.json(
			{
				ok: false,
				code: "INVALID_GATE",
				message: "Incorrect access password.",
			},
			{ status: 401 },
		);
	}

	const res = NextResponse.json({ ok: true, message: "Gate unlocked." });
	res.cookies.set(
		CLIENT_ADMIN_LOGIN_GATE_COOKIE,
		CLIENT_ADMIN_LOGIN_GATE_COOKIE_VALUE,
		getClientAdminGateCookieOptions(),
	);
	return res;
}

export async function handleClientAdminSignIn(request: Request) {
	const cookieStore = await cookies();
	const gate = cookieStore.get(CLIENT_ADMIN_LOGIN_GATE_COOKIE);
	if (gate?.value !== CLIENT_ADMIN_LOGIN_GATE_COOKIE_VALUE) {
		return NextResponse.json(
			{
				ok: false,
				code: "GATE_REQUIRED",
				message: "Complete the access password step first.",
			},
			{ status: 401 },
		);
	}

	let body: AdminSignInBody;
	try {
		body = (await request.json()) as AdminSignInBody;
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
		if (!user?.id) {
			return NextResponse.json(
				{
					ok: false,
					code: "SIGNIN_FAILED",
					message: "Unable to sign in right now.",
				},
				{ status: 500 },
			);
		}

		const profile = await db.profile.findUnique({
			where: { id: user.id },
			select: { adminRole: true, adminIsActive: true },
		});
		if (!profile?.adminRole || !profile.adminIsActive) {
			await supabase.auth.signOut();
			return NextResponse.json(
				{
					ok: false,
					code: "NOT_ADMIN",
					message: "This account is not an active admin.",
				},
				{ status: 403 },
			);
		}

		const res = NextResponse.json({
			ok: true,
			message: "Signed in successfully.",
			redirectTo: "/dashboard",
		});
		clearGateOnResponse(res);
		return res;
	} catch (err) {
		console.error("[client admin-sign-in]", err);
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
