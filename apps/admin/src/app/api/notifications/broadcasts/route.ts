import {
	broadcastNotification,
	BroadcastNotificationError,
	db,
} from "@rotra/db";
import {
	AdminNotificationType,
	NotificationSeverity,
	NotificationType,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

function parseListPagination(searchParams: URLSearchParams): {
	page: number;
	limit: number;
} {
	const pageRaw = searchParams.get("page");
	const limitRaw = searchParams.get("limit");
	const page =
		pageRaw != null && Number.isFinite(Number(pageRaw)) && Number(pageRaw) >= 1
			? Math.floor(Number(pageRaw))
			: 1;
	const limitNum =
		limitRaw != null && Number.isFinite(Number(limitRaw)) && Number(limitRaw) >= 1
			? Math.floor(Number(limitRaw))
			: 20;
	const limit = Math.min(50, Math.max(1, limitNum));
	return { page, limit };
}

export async function GET(request: Request) {
	try {
		const session = await requireAdminSession();
		if (session.adminRole !== "super_admin") {
			return NextResponse.json(
				{ error: "Only Super Admins can list notification broadcasts." },
				{ status: 403 },
			);
		}

		const { searchParams } = new URL(request.url);
		const { page, limit } = parseListPagination(searchParams);
		const skip = (page - 1) * limit;

		const [rows, total] = await Promise.all([
			db.notificationBroadcast.findMany({
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
				select: {
					id: true,
					notificationType: true,
					adminNotificationType: true,
					severity: true,
					title: true,
					body: true,
					appScopes: true,
					tagSlugs: true,
					recipientCount: true,
					relatedEntityType: true,
					relatedEntityId: true,
					targetUrl: true,
					scheduledAt: true,
					createdById: true,
					createdAt: true,
				},
			}),
			db.notificationBroadcast.count(),
		]);

		const serialized = rows.map((row) => ({
			id: row.id,
			notificationType: row.notificationType,
			adminNotificationType: row.adminNotificationType,
			severity: row.severity,
			title: row.title,
			body: row.body,
			appScopes: row.appScopes,
			tagSlugs: row.tagSlugs,
			recipientCount: row.recipientCount,
			relatedEntityType: row.relatedEntityType,
			relatedEntityId: row.relatedEntityId,
			targetUrl: row.targetUrl,
			scheduledAt: row.scheduledAt?.toISOString() ?? null,
			createdById: row.createdById,
			createdAt: row.createdAt.toISOString(),
		}));

		return NextResponse.json({
			rows: serialized,
			page,
			limit,
			total,
			hasMore: skip + rows.length < total,
		});
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		console.error("[notifications broadcasts GET]", error);
		return NextResponse.json(
			{ error: "Failed to list broadcasts." },
			{ status: 500 },
		);
	}
}

const audienceSchema = z
	.object({
		tagSlugs: z.array(z.string().min(1)).optional(),
		adminRoles: z.array(z.enum(["super_admin", "admin"])).optional(),
		excludeProfileIds: z.array(z.string().uuid()).optional(),
	})
	.superRefine((audience, ctx) => {
		const hasTags = Boolean(audience.tagSlugs?.length);
		const hasRoles = Boolean(audience.adminRoles?.length);
		if (!hasTags && !hasRoles) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Audience must include at least one tag slug or admin role selector.",
			});
		}
	});

const bodySchema = z
	.object({
		audience: audienceSchema,
		notificationType: z.nativeEnum(NotificationType).optional(),
		adminNotificationType: z.nativeEnum(AdminNotificationType).optional(),
		severity: z.nativeEnum(NotificationSeverity).optional(),
		title: z.string().min(1).max(200),
		body: z.string().min(1).max(4000),
		appScopes: z.array(z.enum(["client", "admin"])).nonempty(),
		scheduledAt: z.string().datetime().optional().nullable(),
		relatedEntityType: z.string().max(120).optional().nullable(),
		relatedEntityId: z.string().uuid().optional().nullable(),
		targetUrl: z.string().min(1).max(2048).optional().nullable(),
	})
	.superRefine((data, ctx) => {
		if (data.appScopes.includes("admin") && !data.targetUrl?.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "targetUrl is required when appScopes includes admin.",
				path: ["targetUrl"],
			});
		}
	});

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = bodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		if (session.adminRole !== "super_admin") {
			return NextResponse.json(
				{ error: "Only Super Admins can send notification broadcasts." },
				{ status: 403 },
			);
		}

		const data = parsed.data;
		const scheduledAt =
			data.scheduledAt != null ? new Date(data.scheduledAt) : null;

		const result = await broadcastNotification(db, {
			audience: {
				...(data.audience.tagSlugs?.length
					? { tagSlugs: data.audience.tagSlugs }
					: {}),
				...(data.audience.adminRoles?.length
					? { adminRoles: data.audience.adminRoles }
					: {}),
				...(data.audience.excludeProfileIds?.length
					? { excludeProfileIds: data.audience.excludeProfileIds }
					: {}),
			},
			...(data.notificationType != null
				? { notificationType: data.notificationType }
				: {}),
			...(data.adminNotificationType != null
				? { adminNotificationType: data.adminNotificationType }
				: {}),
			...(data.severity != null ? { severity: data.severity } : {}),
			title: data.title,
			body: data.body,
			appScopes: data.appScopes,
			scheduledAt,
			relatedEntityType: data.relatedEntityType ?? null,
			relatedEntityId: data.relatedEntityId ?? null,
			targetUrl: data.targetUrl ?? null,
			createdById: session.profileId,
		});

		return NextResponse.json({ ok: true, ...result });
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		if (error instanceof BroadcastNotificationError) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		console.error("[notifications broadcasts POST]", error);
		return NextResponse.json(
			{ error: "Failed to send broadcast." },
			{ status: 500 },
		);
	}
}
