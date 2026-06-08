"use client";

import { SessionDiscoveryCard } from "@/components/modules/dashboard/session-discovery-card/SessionDiscoveryCard";
import type { SessionDiscoveryItem } from "@/types/session-discovery";

interface SessionListViewProps {
	sessions: SessionDiscoveryItem[];
	onJoinSession?: (sessionId: string) => void;
	isLoading?: boolean;
}

export function SessionListView({
	sessions,
	onJoinSession,
	isLoading,
}: SessionListViewProps) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 px-4 pb-28 pt-36">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-24 animate-pulse rounded-xl bg-bg-elevated"
					/>
				))}
			</div>
		);
	}

	if (sessions.length === 0) {
		return (
			<div className="flex h-full items-center justify-center px-8 pb-28 pt-36 text-center">
				<p className="text-body text-text-secondary">
					No sessions in this area. Try expanding your search radius.
				</p>
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto px-4 pb-28 pt-36">
			<p className="mb-4 text-micro font-bold uppercase tracking-widest text-text-secondary">
				{sessions.length} sessions near you
			</p>
			<div className="flex flex-col gap-3">
				{sessions.map((session) => (
					<SessionDiscoveryCard
						key={session.id}
						session={session}
						variant="list"
						{...(onJoinSession ? { onJoin: onJoinSession } : {})}
					/>
				))}
			</div>
		</div>
	);
}
