export type PlaceStatusFilter = "confirmed" | "unreviewed";

export function placesQueryKey(status?: PlaceStatusFilter) {
	return status ? (["places", status] as const) : (["places"] as const);
}
