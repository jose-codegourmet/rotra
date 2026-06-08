"use client";

import { Clock } from "lucide-react";
import { format } from "date-fns";
import { sessionDiscoveryCardVariants } from "@/components/modules/dashboard/session-discovery-card/SessionDiscoveryCard.variants";
import { formatDistanceKm } from "@/lib/geo/haversine";
import { cn } from "@/lib/utils";
import type { SessionDiscoveryItem } from "@/types/session-discovery";

interface SessionDiscoveryCardProps {
	session: SessionDiscoveryItem;
	variant?: "compact" | "list" | "grid";
	onJoin?: (sessionId: string) => void;
	className?: string;
}

export function SessionDiscoveryCard({
	session,
	variant = "grid",
	onJoin,
	className,
}: SessionDiscoveryCardProps) {
	const isLive = session.status === "active";

	return (
		<article
			className={cn(sessionDiscoveryCardVariants({ variant }), className)}
		>
			<div className={variant === "list" ? "flex min-w-0 flex-1 flex-col gap-2" : ""}>
				<div className="flex items-start justify-between gap-2">
					<span
						className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
							isLive
								? "bg-accent/20 text-accent"
								: "bg-bg-overlay text-text-secondary"
						}`}
					>
						{isLive ? "Live Now" : "Open"}
					</span>
					{session.distanceKm != null && (
						<span className="text-[10px] font-medium text-text-secondary">
							{formatDistanceKm(session.distanceKm)}
						</span>
					)}
				</div>
				<h4 className="text-sm font-bold text-text-primary">{session.clubName}</h4>
				<p className="text-xs text-text-secondary">{session.location}</p>
				<div className="flex items-center gap-2 text-xs text-text-secondary">
					<Clock size={12} />
					<span>{format(new Date(session.dateTime), "EEE · h:mm a")}</span>
				</div>
			</div>
			<div
				className={cn(
					"flex items-center justify-between gap-3",
					variant === "list" && "shrink-0 flex-col items-end",
				)}
			>
				<span className="text-xs font-bold text-accent">
					{session.acceptedCount}/{session.totalSlots} Slots
				</span>
				<button
					type="button"
					onClick={() => onJoin?.(session.id)}
					className="rounded-md bg-accent px-3 py-1 text-[10px] font-bold uppercase text-bg-base"
				>
					Join
				</button>
			</div>
		</article>
	);
}
