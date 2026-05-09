import { AdminUserError } from "@rotra/db";
import { NextResponse } from "next/server";
import { AdminSessionError } from "@/lib/auth/admin-session";

export function adminUserErrorResponse(error: unknown, context: string) {
	if (error instanceof AdminUserError) {
		const statusByCode: Record<AdminUserError["code"], number> = {
			not_found: 404,
			forbidden: 403,
			conflict: 409,
			bad_input: 400,
			bad_state: 409,
		};
		return NextResponse.json(
			{ error: error.message, code: error.code },
			{ status: statusByCode[error.code] },
		);
	}
	if (error instanceof AdminSessionError) {
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);
	}
	console.error(context, error);
	return NextResponse.json(
		{ error: "Failed to process admin users request." },
		{ status: 500 },
	);
}

export function parseAdminRole(input: unknown): "admin" | "super_admin" | null {
	return input === "admin" || input === "super_admin" ? input : null;
}

export function parseUuid(input: unknown): string | null {
	if (typeof input !== "string") return null;
	const value = input.trim();
	if (!value) return null;
	return value;
}
