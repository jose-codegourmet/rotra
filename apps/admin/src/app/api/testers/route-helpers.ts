import type { PrismaClient } from "@prisma/client";
import {
	broadcastNotification,
	db,
	getTesterProfileDetail,
	TagDefinitionError,
	TesterInvitationError,
	type TesterProfileDetail,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { AdminSessionError } from "@/lib/auth/admin-session";

export function parsePositiveInt(
	value: string | null,
	fallback: number,
): number {
	if (value == null || value === "") return fallback;
	const n = Number.parseInt(value, 10);
	return Number.isFinite(n) && n >= 1 ? n : fallback;
}

/** Tester invite notifications are broadcast inside @rotra/db tester-invitation-service. */

export async function notifyTagDefinitionChanged(input: {
	actorProfileId: string;
	title: string;
	body: string;
}) {
	try {
		await broadcastNotification(db, {
			audience: {
				adminRoles: ["super_admin", "admin"],
				excludeProfileIds: [input.actorProfileId],
			},
			notificationType: "platform_announcement",
			adminNotificationType: "tag_definition_changed",
			severity: "info",
			title: input.title,
			body: input.body,
			appScopes: ["admin"],
			targetUrl: "/tags",
			relatedEntityType: "tag_definition",
			relatedEntityId: input.actorProfileId,
			createdById: input.actorProfileId,
		});
	} catch (err) {
		console.error("[tag definition notify]", err);
	}
}

export function serializeTesterProfileDetail(detail: TesterProfileDetail) {
	return {
		...detail,
		tags: detail.tags.map((t) => ({
			...t,
			assignedAt: t.assignedAt.toISOString(),
		})),
		invitations: detail.invitations.map((inv) => ({
			...inv,
			expiresAt: inv.expiresAt.toISOString(),
			revokedAt: inv.revokedAt?.toISOString() ?? null,
			createdAt: inv.createdAt.toISOString(),
		})),
	};
}

export function testerErrorResponse(error: unknown, context: string) {
	if (error instanceof TesterInvitationError) {
		const statusByCode: Record<TesterInvitationError["code"], number> = {
			not_found: 404,
			conflict: 409,
			forbidden: 403,
			bad_input: 400,
			bad_state: 409,
		};
		return NextResponse.json(
			{ error: error.message, code: error.code },
			{ status: statusByCode[error.code] },
		);
	}
	if (error instanceof TagDefinitionError) {
		const statusByCode: Record<TagDefinitionError["code"], number> = {
			not_found: 404,
			conflict: 409,
			invalid_slug: 400,
			reserved: 403,
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
		{ error: "Failed to process testers request." },
		{ status: 500 },
	);
}

export async function jsonTesterProfileDetail(
	client: PrismaClient,
	profileId: string,
) {
	const detail = await getTesterProfileDetail(client, profileId);
	return NextResponse.json({
		profile: serializeTesterProfileDetail(detail),
	});
}
