/** Centralized React Query keys for the signed-in admin's notification inbox. */

export const adminNotificationsRootKey = ["admin-notifications"] as const;

export type AdminNotificationsQueryFilters = {
	page: number;
	limit: number;
};

export function adminNotificationsQueryKey(
	filters: AdminNotificationsQueryFilters,
) {
	return [
		...adminNotificationsRootKey,
		"list",
		filters.page,
		filters.limit,
	] as const;
}
