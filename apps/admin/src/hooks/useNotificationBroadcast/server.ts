import type { BroadcastNotificationResult } from "@rotra/db";

export type NotificationBroadcastListRowSerialized = {
	id: string;
	notificationType: string;
	adminNotificationType: string;
	severity: string;
	title: string;
	body: string;
	appScopes: string[];
	tagSlugs: string[];
	recipientCount: number;
	relatedEntityType: string | null;
	relatedEntityId: string | null;
	targetUrl: string | null;
	scheduledAt: string | null;
	createdById: string | null;
	createdAt: string;
};

export type NotificationBroadcastsListResponse = {
	rows: NotificationBroadcastListRowSerialized[];
	page: number;
	limit: number;
	total: number;
	hasMore: boolean;
};

export type PostNotificationBroadcastPayload = {
	audience: {
		tagSlugs?: string[];
		adminRoles?: ("super_admin" | "admin")[];
		excludeProfileIds?: string[];
	};
	notificationType?: string;
	adminNotificationType?: string;
	severity?: string;
	title: string;
	body: string;
	appScopes: ("client" | "admin")[];
	scheduledAt?: string | null;
	relatedEntityType?: string | null;
	relatedEntityId?: string | null;
	targetUrl?: string | null;
};

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

export type PostNotificationBroadcastResponse = {
	ok: true;
} & BroadcastNotificationResult;

export async function postNotificationBroadcast(
	payload: PostNotificationBroadcastPayload,
): Promise<PostNotificationBroadcastResponse> {
	const response = await fetch("/api/notifications/broadcasts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const raw = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(raw, "Failed to send broadcast."));
	}

	if (
		typeof raw !== "object" ||
		!raw ||
		!("ok" in raw) ||
		raw.ok !== true ||
		!("broadcastId" in raw)
	) {
		throw new Error("Invalid broadcast response.");
	}

	return raw as PostNotificationBroadcastResponse;
}

function buildBroadcastListSearchParams(filters: {
	page: number;
	limit: number;
}): string {
	const p = new URLSearchParams();
	if (filters.page > 1) p.set("page", String(filters.page));
	if (filters.limit !== 20) p.set("limit", String(filters.limit));
	const s = p.toString();
	return s ? `?${s}` : "";
}

export async function fetchNotificationBroadcasts(filters: {
	page: number;
	limit: number;
}): Promise<NotificationBroadcastsListResponse> {
	const qs = buildBroadcastListSearchParams(filters);
	const response = await fetch(`/api/notifications/broadcasts${qs}`, {
		method: "GET",
	});
	const raw = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(raw, "Failed to load broadcasts."));
	}

	if (
		typeof raw !== "object" ||
		!raw ||
		!("rows" in raw) ||
		!("total" in raw)
	) {
		throw new Error("Invalid broadcasts list response.");
	}

	return raw as NotificationBroadcastsListResponse;
}
