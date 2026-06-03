import type { ListTesterProfilesResult, TesterProfileDetail } from "@rotra/db";
import type { TesterDirectoryStatus } from "@rotra/db/client";

export type TesterDirectoryRowSerialized = {
	id: string;
	name: string;
	email: string | null;
	status: TesterDirectoryStatus;
	invitedAt: string;
	invitedByName: string | null;
	latestInvitationId: string | null;
};

export type ListTestersResponse = {
	rows: TesterDirectoryRowSerialized[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

export type TesterInvitationSerialized = {
	id: string;
	status: string;
	expiresAt: string;
	revokedAt: string | null;
	createdAt: string;
	invitedByName: string | null;
};

export type TesterProfileDetailSerialized = {
	id: string;
	name: string;
	email: string | null;
	isTesterAccount: boolean;
	tags: Array<{
		id: string;
		slug: string;
		label: string;
		assignedAt: string;
	}>;
	invitations: TesterInvitationSerialized[];
};

export type TesterDetailResponse = {
	profile: TesterProfileDetailSerialized;
};

export function serializeTestersListResult(
	result: ListTesterProfilesResult,
): ListTestersResponse {
	return {
		...result,
		rows: result.rows.map((row) => ({
			...row,
			invitedAt: row.invitedAt.toISOString(),
		})),
	};
}

export function serializeTesterDetail(
	detail: TesterProfileDetail,
): TesterProfileDetailSerialized {
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

function buildTestersSearchParams(filters: {
	page: number;
	limit: number;
	status?: TesterDirectoryStatus;
}): string {
	const p = new URLSearchParams();
	if (filters.page > 1) p.set("page", String(filters.page));
	if (filters.limit !== 25) p.set("limit", String(filters.limit));
	if (filters.status) p.set("status", filters.status);
	const s = p.toString();
	return s ? `?${s}` : "";
}

export async function fetchTestersList(filters: {
	page: number;
	limit: number;
	status?: TesterDirectoryStatus;
}): Promise<ListTestersResponse> {
	const qs = buildTestersSearchParams(filters);
	const response = await fetch(`/api/testers${qs}`, { method: "GET" });
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load testers."));
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("rows" in payload) ||
		!("total" in payload)
	) {
		throw new Error("Invalid testers response.");
	}

	return payload as ListTestersResponse;
}

export async function fetchTesterDetail(
	id: string,
): Promise<TesterDetailResponse> {
	const response = await fetch(`/api/testers/${encodeURIComponent(id)}`, {
		method: "GET",
	});
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load tester."));
	}

	if (typeof payload !== "object" || !payload || !("profile" in payload)) {
		throw new Error("Invalid tester detail response.");
	}

	return payload as TesterDetailResponse;
}

export async function postInviteTester(body: {
	email: string;
	name: string;
}): Promise<{ ok: boolean; profileId: string; invitationId: string }> {
	const response = await fetch("/api/testers", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to invite tester."));
	}
	return payload as { ok: boolean; profileId: string; invitationId: string };
}

export async function postResendTesterInvite(
	id: string,
): Promise<{ ok: boolean; invitationId: string }> {
	const response = await fetch(
		`/api/testers/${encodeURIComponent(id)}/resend`,
		{ method: "POST" },
	);
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to resend tester invite."),
		);
	}
	return payload as { ok: boolean; invitationId: string };
}

export async function postRevokeTesterInvite(
	id: string,
): Promise<{ ok: boolean }> {
	const response = await fetch(
		`/api/testers/${encodeURIComponent(id)}/revoke`,
		{ method: "POST" },
	);
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to revoke tester invite."),
		);
	}
	return payload as { ok: boolean };
}
