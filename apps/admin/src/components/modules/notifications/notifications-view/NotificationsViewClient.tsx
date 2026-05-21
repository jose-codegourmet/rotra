"use client";

import { Button } from "@/components/ui/button/Button";
import {
	useAdminNotificationsQuery,
	useMarkAllAdminNotificationsRead,
} from "@/hooks/useAdminNotifications/client";
import { adaptAdminNotificationToUiItem } from "@/hooks/useAdminNotifications/server";

import { NotificationsView } from "./NotificationsView";

const NOTIFICATIONS_PAGE_LIMIT = 20;

export function NotificationsViewClient() {
	const { data, isLoading, isError } = useAdminNotificationsQuery(
		{ page: 1, limit: NOTIFICATIONS_PAGE_LIMIT },
		{ refetchInterval: 30_000 },
	);
	const markAllRead = useMarkAllAdminNotificationsRead();

	const notifications =
		data?.rows.map((row) => adaptAdminNotificationToUiItem(row)) ?? [];
	const unreadCount = data?.unreadCount ?? 0;

	return (
		<div className="space-y-4">
			{unreadCount > 0 ? (
				<div className="mx-auto flex max-w-3xl justify-end">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						disabled={markAllRead.isPending}
						onClick={() => markAllRead.mutate()}
					>
						{markAllRead.isPending ? "Marking…" : "Mark all as read"}
					</Button>
				</div>
			) : null}
			{isLoading && !data ? (
				<p className="mx-auto max-w-3xl text-body text-text-secondary">
					Loading notifications…
				</p>
			) : isError ? (
				<p className="mx-auto max-w-3xl text-body text-destructive">
					Unable to load notifications. Please refresh the page.
				</p>
			) : (
				<NotificationsView notifications={notifications} />
			)}
		</div>
	);
}

NotificationsViewClient.displayName = "NotificationsViewClient";
