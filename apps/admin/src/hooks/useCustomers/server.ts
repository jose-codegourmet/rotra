import type { CustomersQueryFilters } from "./queryKey";

export type CustomerDirectoryRowSerialized = {
	id: string;
	name: string;
	email: string | null;
	avatarUrl: string | null;
	isVerified: boolean;
	mmr: number;
	createdAt: string;
};

export type ListCustomersResponse = {
	rows: CustomerDirectoryRowSerialized[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

export type CustomerProfileDetailSerialized = {
	id: string;
	name: string;
	email: string | null;
	phone: string | null;
	avatarUrl: string | null;
	isVerified: boolean;
	emailVerified: boolean;
	mmr: number;
	mmrMatchesPlayed: number;
	playingLevel: string | null;
	formatPreference: string | null;
	courtPosition: string | null;
	playMode: string | null;
	onboardingCompleted: boolean;
	expTotal: number;
	tags: Array<{
		id: string;
		slug: string;
		label: string;
		assignedAt: string;
	}>;
	createdAt: string;
	updatedAt: string;
};

export type CustomerDetailResponse = {
	profile: CustomerProfileDetailSerialized;
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

function buildCustomersSearchParams(filters: CustomersQueryFilters): string {
	const p = new URLSearchParams();
	if (filters.q.trim()) p.set("q", filters.q.trim());
	if (filters.page > 1) p.set("page", String(filters.page));
	if (filters.limit !== 25) p.set("limit", String(filters.limit));
	const s = p.toString();
	return s ? `?${s}` : "";
}

export async function fetchCustomers(
	filters: CustomersQueryFilters,
): Promise<ListCustomersResponse> {
	const qs = buildCustomersSearchParams(filters);
	const response = await fetch(`/api/customers${qs}`, { method: "GET" });
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load customers."));
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("rows" in payload) ||
		!("total" in payload)
	) {
		throw new Error("Invalid customers response.");
	}

	return payload as ListCustomersResponse;
}

export async function fetchCustomerDetail(
	id: string,
): Promise<CustomerDetailResponse> {
	const response = await fetch(`/api/customers/${encodeURIComponent(id)}`, {
		method: "GET",
	});
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load customer."));
	}

	if (typeof payload !== "object" || !payload || !("profile" in payload)) {
		throw new Error("Invalid customer detail response.");
	}

	return payload as CustomerDetailResponse;
}
