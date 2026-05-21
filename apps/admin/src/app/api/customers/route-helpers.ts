import type {
	AdminNotificationType,
	NotificationType,
	PrismaClient,
} from "@prisma/client";
import {
	broadcastNotification,
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

const CUSTOMER_BROADCAST_NOTIFICATION_TYPE =
	"platform_announcement" as NotificationType;
const CUSTOMER_ADMIN_NOTIFICATION_TYPE =
	"admin_profile_changed" as AdminNotificationType;

async function profileDisplayName(
	db: PrismaClient,
	profileId: string,
	fallback: string,
): Promise<string> {
	const row = await db.profile.findUnique({
		where: { id: profileId },
		select: { name: true },
	});
	return row?.name?.trim() || fallback;
}

export type CustomerProfileChangeNotifyInput = {
	actorProfileId: string;
	customerProfileId: string;
	title: string;
	body: string;
};

/**
 * Best-effort fan-out to all active admins (except the actor) after a customer mutation.
 */
export async function notifyCustomerProfileChanged(
	db: PrismaClient,
	input: CustomerProfileChangeNotifyInput,
): Promise<void> {
	try {
		await broadcastNotification(db, {
			audience: {
				adminRoles: ["super_admin", "admin"],
				excludeProfileIds: [input.actorProfileId],
			},
			notificationType: CUSTOMER_BROADCAST_NOTIFICATION_TYPE,
			adminNotificationType: CUSTOMER_ADMIN_NOTIFICATION_TYPE,
			severity: "info",
			title: input.title,
			body: input.body,
			appScopes: ["admin"],
			targetUrl: `/customers/${input.customerProfileId}`,
			relatedEntityType: "customer_profile",
			relatedEntityId: input.customerProfileId,
			createdById: input.actorProfileId,
		});
	} catch (err) {
		console.error("[customer notify]", err);
	}
}

export async function notifyCustomerProfileChangedWithNames(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		customerProfileId: string;
		title: string;
		bodyTemplate: (actorName: string, customerName: string) => string;
	},
): Promise<void> {
	const [actorName, customerName] = await Promise.all([
		profileDisplayName(db, input.actorProfileId, "An admin"),
		profileDisplayName(db, input.customerProfileId, "a customer"),
	]);
	await notifyCustomerProfileChanged(db, {
		actorProfileId: input.actorProfileId,
		customerProfileId: input.customerProfileId,
		title: input.title,
		body: input.bodyTemplate(actorName, customerName),
	});
}
