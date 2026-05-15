import { NotificationsView } from "@/components/modules/notifications/notifications-view/NotificationsView";
import { MOCK_NOTIFICATIONS } from "@/constants/mock-notifications";

export default function NotificationsPage() {
	return <NotificationsView notifications={MOCK_NOTIFICATIONS} />;
}
