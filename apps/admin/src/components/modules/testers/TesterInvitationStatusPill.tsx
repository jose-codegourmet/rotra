"use client";

import type { TesterDirectoryStatus } from "@rotra/db";
import { cn } from "@/lib/utils/tailwind";

const STATUS_STYLES: Record<
	TesterDirectoryStatus,
	{ label: string; className: string }
> = {
	pending: {
		label: "Pending",
		className: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
	},
	active: {
		label: "Active",
		className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
	},
	revoked: {
		label: "Revoked",
		className: "bg-red-500/15 text-red-700 dark:text-red-300",
	},
	expired: {
		label: "Expired",
		className: "bg-bg-elevated text-text-secondary",
	},
};

export function TesterInvitationStatusPill({
	status,
}: {
	status: TesterDirectoryStatus;
}) {
	const config = STATUS_STYLES[status];
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2.5 py-0.5 text-label font-medium",
				config.className,
			)}
		>
			{config.label}
		</span>
	);
}
