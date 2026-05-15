import { NotificationItem } from "@/components/modules/notifications/notification-item/NotificationItem";
import type { Notification } from "@/constants/mock-notifications";
import { countUnreadNotifications } from "@/constants/mock-notifications";

export interface NotificationsViewProps {
	notifications: Notification[];
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
	const unreadCount = countUnreadNotifications(notifications);

	return (
		<div className="mx-auto max-w-3xl space-y-6 px-4 md:px-0">
			<header className="flex h-14 min-h-14 items-center justify-between border-b border-border bg-bg-base">
				<h1 className="text-heading font-semibold text-text-primary">
					Notifications
				</h1>
				{unreadCount > 0 ? (
					<span
						className="text-small text-accent/70"
						title="Coming soon when notifications API is wired"
					>
						Mark all read
					</span>
				) : null}
			</header>
			<p className="text-small text-text-secondary">
				Session, club, and match alerts — mock data until live feeds exist.
			</p>
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
		</div>
	);
}

NotificationsView.displayName = "NotificationsView";
