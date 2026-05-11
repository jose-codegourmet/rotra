import type { PrismaClient } from "@prisma/client";
import {
	CustomerProfileError,
	getCustomerProfileDetail,
	ProfileTagError,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { AdminSessionError } from "@/lib/auth/admin-session";

export function serializeCustomerProfileDetail(
	detail: Awaited<ReturnType<typeof getCustomerProfileDetail>>,
) {
	return {
		...detail,
		createdAt: detail.createdAt.toISOString(),
		updatedAt: detail.updatedAt.toISOString(),
		tags: detail.tags.map((t) => ({
			...t,
			assignedAt: t.assignedAt.toISOString(),
		})),
	};
}

export async function jsonCustomerProfileDetail(
	db: PrismaClient,
	profileId: string,
) {
	const detail = await getCustomerProfileDetail(db, profileId);
	return NextResponse.json({ profile: serializeCustomerProfileDetail(detail) });
}

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
	if (error instanceof ProfileTagError) {
		const statusByCode: Record<ProfileTagError["code"], number> = {
			not_found: 404,
			conflict: 409,
			invalid_label: 400,
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
