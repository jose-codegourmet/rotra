"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PlaceStatusFilter } from "./queryKey";
import { placesQueryKey } from "./queryKey";
import type {
	CreatePlacePayload,
	EditPlacePayload,
	ListPlacesResponse,
} from "./server";
import {
	confirmPlace,
	deletePlace,
	fetchPlaces,
	patchPlace,
	postPlace,
} from "./server";

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

export function useCreatePlace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreatePlacePayload) => postPlace(payload),
		onSuccess: () => {
			toast.success("Place created successfully");
			void queryClient.invalidateQueries({ queryKey: placesQueryKey() });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to create place.",
			);
		},
	});
}

export function useEditPlace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ...payload }: EditPlacePayload) =>
			patchPlace(id, payload),
		onSuccess: () => {
			toast.success("Place updated successfully");
			void queryClient.invalidateQueries({ queryKey: placesQueryKey() });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to update place.",
			);
		},
	});
}

export function useConfirmPlace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => confirmPlace(id),
		onSuccess: () => {
			toast.success("Place confirmed");
			void queryClient.invalidateQueries({ queryKey: placesQueryKey() });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to confirm place.",
			);
		},
	});
}

export function useDeletePlace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id }: { id: string }) => deletePlace(id),
		onSuccess: () => {
			toast.success("Place deleted");
			void queryClient.invalidateQueries({ queryKey: placesQueryKey() });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to delete place.",
			);
		},
	});
}
