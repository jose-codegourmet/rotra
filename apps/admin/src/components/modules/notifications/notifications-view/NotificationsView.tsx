import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { NotificationItem } from "@/components/modules/notifications/notification-item/NotificationItem";
import type { Notification } from "@/constants/mock-notifications";

export interface NotificationsViewProps {
	notifications: Notification[];
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
	return (
		<div className="mx-auto max-w-3xl space-y-8">
			<PageSection
				title="Notifications"
				description="Platform alerts and updates — mock data until live feeds exist."
			>
				{notifications.length === 0 ? (
					<p className="rounded-lg border border-border bg-bg-surface px-4 py-8 text-center text-body text-text-secondary">
						You&apos;re all caught up.
					</p>
				) : (
					<ul className="divide-y divide-border rounded-lg border border-border bg-bg-surface">
						{notifications.map((item) => (
							<li key={item.id}>
								<NotificationItem
									notification={item}
									compact={false}
									className="px-4 py-3"
								/>
							</li>
						))}
					</ul>
				)}
			</PageSection>
		</div>
	);
}

NotificationsView.displayName = "NotificationsView";
