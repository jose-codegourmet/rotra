import { db, listAdminNotificationsForInbox } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { NotificationsViewClient } from "@/components/modules/notifications/notifications-view/NotificationsViewClient";
import { adminNotificationsQueryKey } from "@/hooks/useAdminNotifications/queryKey";
import { serializeAdminNotificationsListResult } from "@/hooks/useAdminNotifications/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

const NOTIFICATIONS_PAGE_FILTERS = { page: 1, limit: 20 } as const;

export default async function NotificationsPage() {
	const session = await requireAdminSession();

	const inboxResult = await listAdminNotificationsForInbox(db, {
		adminId: session.profileId,
		...NOTIFICATIONS_PAGE_FILTERS,
	});

	const queryClient = new QueryClient();
	queryClient.setQueryData(
		adminNotificationsQueryKey(NOTIFICATIONS_PAGE_FILTERS),
		serializeAdminNotificationsListResult(inboxResult),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotificationsViewClient />
		</HydrationBoundary>
	);
}
