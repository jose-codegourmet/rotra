"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";

import { tagDefinitionsQueryKey } from "./queryKey";
import type {
	CreateTagDefinitionPayload,
	TagDefinitionsListResponse,
	UpdateTagDefinitionPayload,
} from "./server";
import {
	fetchTagDefinitions,
	patchTagDefinition,
	postTagDefinition,
} from "./server";

export { tagDefinitionsQueryKey };

export function useTagDefinitionsQuery(options?: {
	initialData?: TagDefinitionsListResponse;
}) {
	return useQuery({
		queryKey: tagDefinitionsQueryKey(),
		queryFn: fetchTagDefinitions,
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}

export function useCreateTagDefinition() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateTagDefinitionPayload) => postTagDefinition(body),
		onSuccess: () => {
			toast.success("Tag definition created.");
			void queryClient.invalidateQueries({
				queryKey: tagDefinitionsQueryKey(),
			});
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to create tag definition.",
			);
		},
	});
}

export function useUpdateTagDefinition(id: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: UpdateTagDefinitionPayload) =>
			patchTagDefinition(id, body),
		onSuccess: () => {
			toast.success("Tag definition updated.");
			void queryClient.invalidateQueries({
				queryKey: tagDefinitionsQueryKey(),
			});
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update tag definition.",
			);
		},
	});
}
