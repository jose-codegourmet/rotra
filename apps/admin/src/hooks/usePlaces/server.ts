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
	description: string | null;
	phone: string | null;
	website: string | null;
	status: PlaceStatusFilter;
	submittedBy: PlaceProfileRef | null;
	reviewedBy: PlaceProfileRef | null;
	createdAt: string;
};

export type ListPlacesResponse = {
	places: PlaceRow[];
};

export type CreatePlacePayload = {
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	description?: string;
	phone?: string;
	website?: string;
};

export type EditPlacePayload = {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	description?: string;
	phone?: string;
	website?: string;
};

export type ConfirmPlacePayload = {
	id: string;
};

export type DeletePlacePayload = {
	id: string;
};

export type PlaceMutationResponse = {
	place: PlaceRow;
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

async function parseMutationResponse(
	response: Response,
	fallback: string,
): Promise<PlaceMutationResponse> {
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, fallback));
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("place" in payload) ||
		typeof payload.place !== "object" ||
		!payload.place
	) {
		throw new Error("Invalid place response.");
	}

	return payload as PlaceMutationResponse;
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

export async function postPlace(
	payload: CreatePlacePayload,
): Promise<PlaceMutationResponse> {
	const response = await fetch("/api/places", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	return parseMutationResponse(response, "Failed to create place.");
}

export async function patchPlace(
	id: string,
	payload: Omit<EditPlacePayload, "id">,
): Promise<PlaceMutationResponse> {
	const response = await fetch(`/api/places/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	return parseMutationResponse(response, "Failed to update place.");
}

export async function confirmPlace(id: string): Promise<PlaceMutationResponse> {
	const response = await fetch(`/api/places/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status: "confirmed" }),
	});

	return parseMutationResponse(response, "Failed to confirm place.");
}

export async function deletePlace(id: string): Promise<void> {
	const response = await fetch(`/api/places/${id}`, {
		method: "DELETE",
	});
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to delete place."));
	}
}
