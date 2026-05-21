/** Centralized React Query keys for notification broadcasts. */

export const notificationBroadcastsRootKey = ["notification-broadcasts"] as const;

export type NotificationBroadcastsListFilters = {
	page: number;
	limit: number;
};

export function notificationBroadcastsListQueryKey(
	filters: NotificationBroadcastsListFilters,
) {
	return [
		...notificationBroadcastsRootKey,
		"list",
		filters.page,
		filters.limit,
	] as const;
}
