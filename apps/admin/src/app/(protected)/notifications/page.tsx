import { NotificationsView } from "@/components/modules/notifications/notifications-view/NotificationsView";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function NotificationsPage() {
	await requireAdminSession();

	return <NotificationsView notifications={MOCK_NOTIFICATIONS} />;
}
