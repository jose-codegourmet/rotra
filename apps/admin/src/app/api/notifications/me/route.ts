import { db, listAdminNotificationsForInbox } from "@rotra/db";
import { NextResponse } from "next/server";

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
		limitRaw != null &&
		Number.isFinite(Number(limitRaw)) &&
		Number(limitRaw) >= 1
			? Math.floor(Number(limitRaw))
			: 20;
	const limit = Math.min(50, Math.max(1, limitNum));
	return { page, limit };
}

export async function GET(request: Request) {
	try {
		const session = await requireAdminSession();
		const { searchParams } = new URL(request.url);
		const { page, limit } = parseListPagination(searchParams);

		const result = await listAdminNotificationsForInbox(db, {
			adminId: session.profileId,
			page,
			limit,
		});

		const rows = result.rows.map((row) => ({
			id: row.id,
			type: row.type,
			severity: row.severity,
			targetUrl: row.targetUrl,
			title: row.title,
			body: row.body,
			readAt: row.readAt?.toISOString() ?? null,
			createdAt: row.createdAt.toISOString(),
		}));

		return NextResponse.json({
			rows,
			page: result.page,
			limit: result.limit,
			total: result.total,
			unreadCount: result.unreadCount,
			hasMore: result.hasMore,
		});
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		console.error("[notifications me GET]", error);
		return NextResponse.json(
			{ error: "Failed to load notifications." },
			{ status: 500 },
		);
	}
}
