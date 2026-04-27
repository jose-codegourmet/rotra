"use client";

import { cn } from "@/lib/utils";
import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

const STATUS_STYLES: Record<ClubApplicationListRowDto["status"], string> = {
	pending: "bg-warning/15 text-warning border-warning/40",
	in_review: "bg-accent/10 text-accent border-accent/30",
	approved: "bg-accent/20 text-text-primary border-accent/40",
	rejected: "bg-error/10 text-error border-error/40",
	cancelled: "bg-bg-overlay text-text-secondary border-border",
};

export function ApplicationStatusPill({
	status,
}: {
	status: ClubApplicationListRowDto["status"];
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				STATUS_STYLES[status],
			)}
		>
			{status.replaceAll("_", " ")}
		</span>
	);
}
