"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import { formatDistanceKm } from "@/lib/geo/haversine";
import {
	formatSessionTime,
	getSessionDisplayStatus,
	getSessionDisplayStatusLabel,
} from "@/lib/dashboard/venue-session-utils";
import { cn } from "@/lib/utils";
import type {
	SessionDiscoveryItem,
	VenueSessionGroup,
} from "@/types/session-discovery";

function SessionRow({
	session,
	onJoin,
}: {
	session: SessionDiscoveryItem;
	onJoin: (id: string) => void;
}) {
	const status = getSessionDisplayStatus(session);
	const isLive = status === "live";

	return (
		<div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
			<span
				className={cn(
					"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
					isLive
						? "bg-accent/20 text-accent"
						: "bg-bg-elevated text-text-secondary",
				)}
			>
				{getSessionDisplayStatusLabel(status)}
			</span>
			<span className="min-w-0 flex-1 text-sm font-medium text-text-primary">
				{formatSessionTime(session)}
			</span>
			<span className="shrink-0 text-xs font-bold text-accent">
				{session.acceptedCount}/{session.totalSlots}
			</span>
			<button
				type="button"
				onClick={() => onJoin(session.id)}
				className="shrink-0 rounded-md bg-accent px-3 py-1 text-[10px] font-bold uppercase text-bg-base"
			>
				Join
			</button>
		</div>
	);
}

interface VenueSessionsModalProps {
	group: VenueSessionGroup | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onJoin: (sessionId: string) => void;
}

export function VenueSessionsModal({
	group,
	open,
	onOpenChange,
	onJoin,
}: VenueSessionsModalProps) {
	if (!group) return null;

	const sessionCount = group.sessions.length;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					"max-h-[85dvh] overflow-y-auto sm:max-w-md",
					"top-auto bottom-0 translate-y-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
					"rounded-b-none rounded-t-xl sm:rounded-xl",
				)}
			>
				<DialogHeader>
					<DialogTitle>{group.venueName}</DialogTitle>
					<DialogDescription>
						{[
							group.venueAddress,
							group.distanceKm != null
								? `${formatDistanceKm(group.distanceKm)} away`
								: null,
						]
							.filter(Boolean)
							.join(" · ")}
					</DialogDescription>
				</DialogHeader>
				<div className="border-t border-border pt-2">
					<p className="mb-2 text-xs font-bold uppercase tracking-widest text-text-secondary">
						{sessionCount} session{sessionCount === 1 ? "" : "s"} at this venue
					</p>
					{group.sessions.map((session) => (
						<SessionRow key={session.id} session={session} onJoin={onJoin} />
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
