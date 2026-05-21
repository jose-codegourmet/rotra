import type { ListAdminNotificationsForInboxResult } from "@rotra/db";

import type {
	Notification,
	NotificationKind,
} from "@/constants/mock-notifications";

import type { AdminNotificationsQueryFilters } from "./queryKey";

export type AdminNotificationRowSerialized = {
	id: string;
	type: string;
	severity: string;
	targetUrl: string;
	title: string;
	body: string | null;
	readAt: string | null;
	createdAt: string;
};

export type AdminNotificationsListResponse = {
	rows: AdminNotificationRowSerialized[];
	page: number;
	limit: number;
	total: number;
	unreadCount: number;
	hasMore: boolean;
};

export function serializeAdminNotificationsListResult(
	result: ListAdminNotificationsForInboxResult,
): AdminNotificationsListResponse {
	return {
		rows: result.rows.map((row) => ({
			id: row.id,
			type: row.type,
			severity: row.severity,
			targetUrl: row.targetUrl,
			title: row.title,
			body: row.body,
			readAt: row.readAt?.toISOString() ?? null,
			createdAt: row.createdAt.toISOString(),
		})),
		page: result.page,
		limit: result.limit,
		total: result.total,
		unreadCount: result.unreadCount,
		hasMore: result.hasMore,
	};
}

const ADMIN_NOTIFICATION_TYPE_TO_KIND: Record<string, NotificationKind> = {
	platform_announcement: "system",
	admin_profile_changed: "user",
};

function formatRelativeTime(iso: string): string {
	const date = new Date(iso);
	const now = Date.now();
	const diffMs = now - date.getTime();
	if (diffMs < 0) return "Just now";

	const minutes = Math.floor(diffMs / 60_000);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes} min ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hr ago`;

	const days = Math.floor(hours / 24);
	if (days === 1) return "Yesterday";
	if (days < 7) return `${days} days ago`;

	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year:
			date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
	});
}

export function adaptAdminNotificationToUiItem(
	row: AdminNotificationRowSerialized,
): Notification {
	const severity =
		row.severity === "urgent" ||
		row.severity === "warning" ||
		row.severity === "info"
			? row.severity
			: "info";

	return {
		id: row.id,
		kind: ADMIN_NOTIFICATION_TYPE_TO_KIND[row.type] ?? "system",
		severity,
		title: row.title,
		message: row.body ?? "",
		time: formatRelativeTime(row.createdAt),
		unread: row.readAt == null,
		targetUrl: row.targetUrl,
	};
}

function parseApiErrorMessage(payload: unknown, fallback: string): string {
	if (
		typeof payload === "object" &&
		payload &&
		"error" in payload &&
		typeof payload.error === "string"
	) {
		return payload.error;
	}
	return fallback;
}

function buildListSearchParams(
	filters: AdminNotificationsQueryFilters,
): string {
	const p = new URLSearchParams();
	if (filters.page > 1) p.set("page", String(filters.page));
	if (filters.limit !== 20) p.set("limit", String(filters.limit));
	const s = p.toString();
	return s ? `?${s}` : "";
}

export async function fetchAdminNotifications(
	filters: AdminNotificationsQueryFilters,
): Promise<AdminNotificationsListResponse> {
	const qs = buildListSearchParams(filters);
	const response = await fetch(`/api/notifications/me${qs}`, {
		method: "GET",
	});
	const raw = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(raw, "Failed to load notifications."));
	}

	if (
		typeof raw !== "object" ||
		!raw ||
		!("rows" in raw) ||
		!("unreadCount" in raw)
	) {
		throw new Error("Invalid notifications response.");
	}

	return raw as AdminNotificationsListResponse;
}

export async function postMarkAllAdminNotificationsRead(): Promise<{
	ok: true;
	count: number;
}> {
	const response = await fetch("/api/notifications/me/read-all", {
		method: "POST",
	});
	const raw = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(raw, "Failed to mark notifications as read."),
		);
	}

	if (
		typeof raw !== "object" ||
		!raw ||
		!("ok" in raw) ||
		raw.ok !== true ||
		!("count" in raw)
	) {
		throw new Error("Invalid mark-all-read response.");
	}

	return raw as { ok: true; count: number };
}
