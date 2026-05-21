"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/tailwind";

import {
	type NotificationsBadgeVariants,
	notificationsBadgeVariants,
} from "./NotificationsBadge.variants";

function formatNotificationsCount(count: number, max: number): string {
	if (count <= max) return String(count);
	return `${max}+`;
}

export type NotificationsBadgeProps = Omit<
	HTMLAttributes<HTMLSpanElement>,
	"children"
> &
	NotificationsBadgeVariants & {
		count: number;
		max?: number;
		/** When set, the badge is wrapped in a link to this route */
		href?: string;
		/** Overrides auto-generated label for screen readers */
		"aria-label"?: string;
	};

export function NotificationsBadge({
	className,
	count,
	max = 99,
	size,
	tone,
	href,
	"aria-label": ariaLabelProp,
	...props
}: NotificationsBadgeProps) {
	if (count <= 0) return null;

	const label =
		ariaLabelProp ??
		`${count > max ? `${max}+` : count} unread notification${count === 1 ? "" : "s"}`;

	const badge = (
		<span
			role="status"
			aria-label={label}
			className={cn(notificationsBadgeVariants({ size, tone }), className)}
			{...props}
		>
			{formatNotificationsCount(count, max)}
		</span>
	);

	if (href) {
		return (
			<Link
				href={href}
				className="inline-flex shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-full"
				aria-label={label}
			>
				{badge}
			</Link>
		);
	}

	return badge;
}

NotificationsBadge.displayName = "NotificationsBadge";
