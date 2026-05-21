"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	type AdminNotificationsQueryFilters,
	adminNotificationsQueryKey,
	adminNotificationsRootKey,
} from "./queryKey";
import {
	fetchAdminNotifications,
	postMarkAllAdminNotificationsRead,
} from "./server";

export { adminNotificationsQueryKey };

const DEFAULT_REFETCH_INTERVAL_MS = 30_000;

export function useAdminNotificationsQuery(
	filters: AdminNotificationsQueryFilters,
	options?: { enabled?: boolean; refetchInterval?: number | false },
) {
	return useQuery({
		queryKey: adminNotificationsQueryKey(filters),
		queryFn: () => fetchAdminNotifications(filters),
		enabled: options?.enabled ?? true,
		refetchInterval:
			options?.refetchInterval === false
				? false
				: (options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL_MS),
	});
}

export function useMarkAllAdminNotificationsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postMarkAllAdminNotificationsRead,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
		},
	});
}
