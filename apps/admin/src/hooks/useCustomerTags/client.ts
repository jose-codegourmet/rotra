"use client";

import { slugifyTag } from "@rotra/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";
import {
	deleteCustomerTag,
	postCustomerTag,
} from "@/hooks/useCustomerDetail/server";

/**
 * Programmatic tag add (e.g. non-form callers). Form flows should use
 * `useMutation` + `postCustomerTag` inside the form module for guideline audits.
 */
export function useAddProfileTag(profileId: string) {
	const router = useRouter();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (label: string) => postCustomerTag(profileId, label),
		onSuccess: (_data, label) => {
			const slug = slugifyTag(label);
			toast.success(`Tag added (slug: ${slug}).`);
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
			router.refresh();
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Failed to add tag.";
			toast.error(message);
		},
	});
}

export function useRemoveProfileTag(profileId: string) {
	const router = useRouter();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (tagId: string) => deleteCustomerTag(profileId, tagId),
		onSuccess: () => {
			toast.success("Tag removed.");
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
			router.refresh();
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Failed to remove tag.";
			toast.error(message);
		},
	});
}
