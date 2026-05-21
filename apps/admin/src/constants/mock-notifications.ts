/** Static mock notifications for admin UI — no API. */

export type NotificationKind = "approval" | "moderation" | "system" | "user";

export type NotificationSeverity = "urgent" | "warning" | "info";

export type Notification = {
	id: string;
	kind: NotificationKind;
	severity: NotificationSeverity;
	title: string;
	message: string;
	/** Human-friendly relative time, e.g. "12 min ago" */
	time: string;
	unread: boolean;
	/** Deep link when the notification row is actionable */
	targetUrl?: string;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
	{
		id: "1",
		kind: "approval",
		severity: "warning",
		title: "Club owner approval pending",
		message: "North Court Collective is waiting for review.",
		time: "3 min ago",
		unread: true,
	},
	{
		id: "2",
		kind: "moderation",
		severity: "urgent",
		title: "New moderation flag",
		message: "User report #4821 opened for spam on club chat.",
		time: "12 min ago",
		unread: true,
	},
	{
		id: "3",
		kind: "system",
		severity: "urgent",
		title: "Kill switch changed",
		message: "`payments_stripe` was toggled off by admin.",
		time: "1 hr ago",
		unread: true,
	},
	{
		id: "4",
		kind: "user",
		severity: "info",
		title: "Customer verification update",
		message: "Player profile `player_9k2` completed phone verification.",
		time: "2 hr ago",
		unread: true,
	},
	{
		id: "5",
		kind: "approval",
		severity: "info",
		title: "Application approved",
		message: "South Bay Shuttle Club owner application was approved.",
		time: "3 hr ago",
		unread: true,
	},
	{
		id: "6",
		kind: "system",
		severity: "info",
		title: "Platform config updated",
		message: "Tier Gold MMR threshold changed by super_admin.",
		time: "5 hr ago",
		unread: true,
	},
	{
		id: "7",
		kind: "moderation",
		severity: "warning",
		title: "Flag resolved",
		message: "Moderation item #4799 was closed as resolved.",
		time: "Yesterday",
		unread: true,
	},
	{
		id: "8",
		kind: "user",
		severity: "info",
		title: "Waitlist signup spike",
		message: "47 new waitlist entries in the last 24 hours.",
		time: "Yesterday",
		unread: true,
	},
	{
		id: "9",
		kind: "system",
		severity: "info",
		title: "Scheduled maintenance notice",
		message: "Database backup completed successfully at 02:00 UTC.",
		time: "2 days ago",
		unread: false,
	},
	{
		id: "10",
		kind: "approval",
		severity: "info",
		title: "Documents uploaded",
		message: "Riverside BC uploaded ownership documents for review.",
		time: "3 days ago",
		unread: false,
	},
	{
		id: "11",
		kind: "moderation",
		severity: "warning",
		title: "Appeal submitted",
		message: "User appealed a 7-day mute on club forums.",
		time: "4 days ago",
		unread: false,
	},
	{
		id: "12",
		kind: "system",
		severity: "urgent",
		title: "API rate limit alert",
		message: "External webhook endpoint returned 429 for 15 minutes.",
		time: "5 days ago",
		unread: false,
	},
];

/** Notifications matching `severity` (stable order: same as MOCK_NOTIFICATIONS). */
export function notificationsBySeverity(
	severity: NotificationSeverity,
): Notification[] {
	return MOCK_NOTIFICATIONS.filter((n) => n.severity === severity);
}

/** Count of unread notifications in the mock list (for badge demos). */
export function countUnreadNotifications(
	notifications: Notification[],
): number {
	return notifications.filter((n) => n.unread).length;
}
