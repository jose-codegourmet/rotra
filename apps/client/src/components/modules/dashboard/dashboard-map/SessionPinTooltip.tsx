"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatDistanceKm } from "@/lib/geo/haversine";
import type { SessionDiscoveryItem } from "@/types/session-discovery";

interface SessionPinTooltipProps {
	session: SessionDiscoveryItem;
	onJoin?: (sessionId: string) => void;
}

export function SessionPinTooltip({ session, onJoin }: SessionPinTooltipProps) {
	const isLive = session.status === "active";
	const timeLabel = format(new Date(session.dateTime), "h:mm a");

	return (
		<div className="w-56 rounded-xl border border-outline-variant/20 bg-bg-base/80 p-4 shadow-2xl backdrop-blur-xl">
			<div className="mb-2 flex items-start justify-between gap-2">
				<span
					className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
						isLive
							? "bg-accent/20 text-accent"
							: "bg-bg-elevated text-text-secondary"
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
			<h4 className="mb-1 text-sm font-bold text-text-primary">
				{session.clubName}
			</h4>
			<p className="text-xs text-text-secondary">{session.location}</p>
			<div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
				<Clock size={12} />
				<span>{timeLabel}</span>
			</div>
			<div className="mt-3 flex items-center justify-between">
				<span className="text-xs font-bold text-accent">
					{session.acceptedCount}/{session.totalSlots} Slots Filled
				</span>
				{onJoin ? (
					<button
						type="button"
						onClick={() => onJoin(session.id)}
						className="rounded-md bg-accent px-3 py-1 text-[10px] font-bold uppercase text-bg-base"
					>
						Join
					</button>
				) : (
					<Link
						href={`/sessions/${session.id}`}
						className="rounded-md bg-accent px-3 py-1 text-[10px] font-bold uppercase text-bg-base"
					>
						Join
					</Link>
				)}
			</div>
		</div>
	);
}
