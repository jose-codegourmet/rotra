import { CustomerProfileError } from "@rotra/db";
import { NextResponse } from "next/server";
import { AdminSessionError } from "@/lib/auth/admin-session";

export function customerProfileErrorResponse(error: unknown, context: string) {
	if (error instanceof CustomerProfileError) {
		const statusByCode: Record<CustomerProfileError["code"], number> = {
			not_found: 404,
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
		{ error: "Failed to process customer profiles request." },
		{ status: 500 },
	);
}

export function parsePositiveInt(
	value: string | null,
	fallback: number,
): number {
	if (value == null || value === "") return fallback;
	const n = Number.parseInt(value, 10);
	return Number.isFinite(n) && n >= 1 ? n : fallback;
}
