"use client";

import { Clock } from "lucide-react";
import { formatDistanceKm } from "@/lib/geo/haversine";
import {
	formatSessionTime,
	formatSessionTimeRange,
	getSessionDisplayStatus,
	getSessionDisplayStatusLabel,
} from "@/lib/dashboard/venue-session-utils";
import { cn } from "@/lib/utils";
import type {
	SessionDiscoveryItem,
	VenueSessionGroup,
} from "@/types/session-discovery";
import { PlayerAvatarStack } from "./PlayerAvatarStack";

function SessionStatusBadge({
	session,
	className,
}: {
	session: SessionDiscoveryItem;
	className?: string;
}) {
	const status = getSessionDisplayStatus(session);
	const isLive = status === "live";

	return (
		<span
			className={cn(
				"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
				isLive
					? "bg-accent/20 text-accent"
					: "bg-bg-elevated text-text-secondary",
				className,
			)}
		>
			{status === "live" ? "Live Now" : getSessionDisplayStatusLabel(status)}
		</span>
	);
}

function JoinButton({
	sessionId,
	onJoin,
}: {
	sessionId: string;
	onJoin: (id: string) => void;
}) {
	return (
		<button
			type="button"
			onClick={(event) => {
				event.stopPropagation();
				onJoin(sessionId);
			}}
			className="shrink-0 rounded-md bg-accent px-3 py-1 text-[10px] font-bold uppercase text-bg-base"
		>
			Join
		</button>
	);
}

interface VenuePinTooltipProps {
	group: VenueSessionGroup;
	onJoin: (id: string) => void;
	onOpenModal: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

function SingleSessionTooltip({
	session,
	onJoin,
}: {
	session: SessionDiscoveryItem;
	onJoin: (id: string) => void;
}) {
	return (
		<>
			<div className="mb-2 flex items-start justify-between gap-2">
				<SessionStatusBadge session={session} />
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
				<span>{formatSessionTimeRange(session)}</span>
			</div>
			<div className="mt-3">
				<PlayerAvatarStack session={session} />
			</div>
			<div className="mt-3 flex items-center justify-between">
				<span className="text-xs font-bold text-accent">
					{session.acceptedCount}/{session.totalSlots} Slots
				</span>
				<JoinButton sessionId={session.id} onJoin={onJoin} />
			</div>
		</>
	);
}

function MultiSessionRow({
	session,
	onJoin,
}: {
	session: SessionDiscoveryItem;
	onJoin: (id: string) => void;
}) {
	return (
		<div className="flex items-center gap-2 py-2">
			<SessionStatusBadge session={session} />
			<span className="min-w-0 flex-1 truncate text-xs font-medium text-text-primary">
				{formatSessionTime(session)}
			</span>
			<span className="shrink-0 text-[10px] font-bold text-accent">
				{session.acceptedCount}/{session.totalSlots}
			</span>
			<JoinButton sessionId={session.id} onJoin={onJoin} />
		</div>
	);
}

function MultiSessionTooltip({
	group,
	onJoin,
	onOpenModal,
}: {
	group: VenueSessionGroup;
	onJoin: (id: string) => void;
	onOpenModal: () => void;
}) {
	const previewSessions = group.sessions.slice(0, 2);
	const remainingCount = group.sessions.length - 2;

	return (
		<>
			<div className="mb-2 flex items-start justify-between gap-2">
				<h4 className="text-sm font-bold text-text-primary">{group.venueName}</h4>
				{group.distanceKm != null && (
					<span className="shrink-0 text-[10px] font-medium text-text-secondary">
						{formatDistanceKm(group.distanceKm)} away
					</span>
				)}
			</div>
			<div className="mb-2 border-t border-outline-variant/20" />
			<div className="divide-y divide-outline-variant/10">
				{previewSessions.map((session) => (
					<div key={session.id}>
						<MultiSessionRow session={session} onJoin={onJoin} />
						<div className="pb-2">
							<PlayerAvatarStack session={session} compact />
						</div>
					</div>
				))}
			</div>
			{remainingCount > 0 && (
				<button
					type="button"
					onClick={(event) => {
						event.stopPropagation();
						onOpenModal();
					}}
					className="mt-2 w-full rounded-lg border border-outline-variant/20 py-2 text-[10px] font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent/10"
				>
					See {remainingCount} more session{remainingCount === 1 ? "" : "s"}
				</button>
			)}
		</>
	);
}

export function VenuePinTooltip({
	group,
	onJoin,
	onOpenModal,
	onMouseEnter,
	onMouseLeave,
}: VenuePinTooltipProps) {
	const isSingle = group.sessions.length === 1;
	const singleSession = group.sessions[0];

	if (isSingle && !singleSession) return null;

	return (
		<div
			className="w-64 rounded-xl border border-outline-variant/20 bg-bg-base/80 p-4 shadow-2xl backdrop-blur-xl"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={(event) => event.stopPropagation()}
			role="dialog"
			aria-label={`Sessions at ${group.venueName}`}
		>
			{isSingle && singleSession ? (
				<SingleSessionTooltip session={singleSession} onJoin={onJoin} />
			) : (
				<MultiSessionTooltip
					group={group}
					onJoin={onJoin}
					onOpenModal={onOpenModal}
				/>
			)}
		</div>
	);
}
