import type { PlaceStatusFilter } from "./queryKey";

export type PlaceProfileRef = {
	id: string;
	displayName: string;
};

export type PlaceRow = {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	status: PlaceStatusFilter;
	submittedBy: PlaceProfileRef | null;
	reviewedBy: PlaceProfileRef | null;
	createdAt: string;
};

export type ListPlacesResponse = {
	places: PlaceRow[];
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

export async function fetchPlaces(
	status?: PlaceStatusFilter,
): Promise<ListPlacesResponse> {
	const url = status ? `/api/places?status=${status}` : "/api/places";
	const response = await fetch(url, { method: "GET" });
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load places."));
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("places" in payload) ||
		!Array.isArray(payload.places)
	) {
		throw new Error("Invalid places response.");
	}

	return payload as ListPlacesResponse;
}
