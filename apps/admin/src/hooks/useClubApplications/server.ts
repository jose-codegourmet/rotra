import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

export type ClubApplicationsListResponse = {
	rows: ClubApplicationListRowDto[];
	total: number;
	page: number;
	pageSize: number;
};

export type ClubNameCollisionDto = {
	id: string;
	name: string;
	locationCity: string | null;
	status: string;
	ownerName: string | null;
	createdAt: string;
};

export async function fetchClubApplicationsList(params: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}): Promise<ClubApplicationsListResponse> {
	const sp = new URLSearchParams();
	sp.set("page", String(params.page));
	sp.set("pageSize", String(params.pageSize));
	if (params.status) sp.set("status", params.status);
	if (params.sort) sp.set("sort", params.sort);
	if (params.playerId) sp.set("playerId", params.playerId);

	const res = await fetch(`/api/club-applications?${sp.toString()}`);
	if (!res.ok) {
		const body = (await res.json().catch(() => null)) as {
			error?: string;
		} | null;
		throw new Error(body?.error ?? `Request failed (${res.status})`);
	}
	return res.json() as Promise<ClubApplicationsListResponse>;
}

export async function approveClubApplicationRequest(
	applicationId: string,
): Promise<{ clubId: string; applicationId: string }> {
	const res = await fetch(
		`/api/club-applications/${encodeURIComponent(applicationId)}/approve`,
		{ method: "POST" },
	);
	const data = (await res.json().catch(() => null)) as {
		error?: string;
		clubId?: string;
		applicationId?: string;
	} | null;
	if (!res.ok) {
		throw new Error(data?.error ?? `Request failed (${res.status})`);
	}
	if (!data?.clubId || !data?.applicationId) {
		throw new Error("Invalid response from server.");
	}
	return { clubId: data.clubId, applicationId: data.applicationId };
}

export async function rejectClubApplicationRequest(params: {
	applicationId: string;
	reason: string;
	reviewNote?: string | null;
}): Promise<void> {
	const res = await fetch(
		`/api/club-applications/${encodeURIComponent(params.applicationId)}/reject`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				reason: params.reason,
				...(params.reviewNote != null && params.reviewNote !== ""
					? { reviewNote: params.reviewNote }
					: {}),
			}),
		},
	);
	const data = (await res.json().catch(() => null)) as {
		error?: string;
	} | null;
	if (!res.ok) {
		throw new Error(data?.error ?? `Request failed (${res.status})`);
	}
}

export async function fetchClubApplicationNameCollisions(
	applicationId: string,
): Promise<{ clubs: ClubNameCollisionDto[] }> {
	const res = await fetch(
		`/api/club-applications/${encodeURIComponent(applicationId)}/name-collisions`,
	);
	const data = (await res.json().catch(() => null)) as {
		error?: string;
		clubs?: ClubNameCollisionDto[];
	} | null;
	if (!res.ok) {
		throw new Error(data?.error ?? `Request failed (${res.status})`);
	}
	return { clubs: data?.clubs ?? [] };
}

export async function bulkRejectClubApplicationsRequest(params: {
	applicationIds: string[];
	reason: string;
	reviewNote?: string | null;
}): Promise<void> {
	const res = await fetch("/api/club-applications/bulk-reject", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			applicationIds: params.applicationIds,
			reason: params.reason,
			...(params.reviewNote != null && params.reviewNote !== ""
				? { reviewNote: params.reviewNote }
				: {}),
		}),
	});
	const data = (await res.json().catch(() => null)) as {
		error?: string;
	} | null;
	if (!res.ok) {
		throw new Error(data?.error ?? `Request failed (${res.status})`);
	}
}
