"use client";

import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
	notificationBroadcastsListQueryKey,
	notificationBroadcastsRootKey,
	type NotificationBroadcastsListFilters,
} from "./queryKey";
import {
	fetchNotificationBroadcasts,
	postNotificationBroadcast,
	type PostNotificationBroadcastPayload,
} from "./server";

export { notificationBroadcastsListQueryKey };

export function useBroadcastNotification() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: PostNotificationBroadcastPayload) =>
			postNotificationBroadcast(payload),
		onSuccess: (data) => {
			toast.success(
				`Broadcast queued (${data.recipientCount} recipients matched; ${data.clientCount} client / ${data.adminCount} admin rows).`,
			);
			void queryClient.invalidateQueries({
				queryKey: [...notificationBroadcastsRootKey],
			});
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Failed to send broadcast.";
			toast.error(message);
		},
	});
}

export function useNotificationBroadcastsQuery(
	filters: NotificationBroadcastsListFilters,
	options?: { enabled?: boolean },
) {
	return useQuery({
		queryKey: notificationBroadcastsListQueryKey(filters),
		queryFn: () => fetchNotificationBroadcasts(filters),
		enabled: options?.enabled ?? true,
	});
}
