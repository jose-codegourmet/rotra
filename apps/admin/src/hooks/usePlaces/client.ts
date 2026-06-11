"use client";

import { useQuery } from "@tanstack/react-query";

import type { PlaceStatusFilter } from "./queryKey";
import { placesQueryKey } from "./queryKey";
import type { ListPlacesResponse } from "./server";
import { fetchPlaces } from "./server";

export { placesQueryKey };

export function usePlacesQuery(
	status?: PlaceStatusFilter,
	options?: {
		initialData?: ListPlacesResponse;
	},
) {
	return useQuery({
		queryKey: placesQueryKey(status),
		queryFn: () => fetchPlaces(status),
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}
