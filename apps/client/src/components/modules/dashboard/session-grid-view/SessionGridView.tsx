"use client";

import { SessionDiscoveryCard } from "@/components/modules/dashboard/session-discovery-card/SessionDiscoveryCard";
import type { SessionDiscoveryItem } from "@/types/session-discovery";

interface SessionGridViewProps {
	sessions: SessionDiscoveryItem[];
	onJoinSession?: (sessionId: string) => void;
	isLoading?: boolean;
}

export function SessionGridView({
	sessions,
	onJoinSession,
	isLoading,
}: SessionGridViewProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 px-4 pb-28 pt-36 sm:grid-cols-2 xl:grid-cols-3">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="h-40 animate-pulse rounded-xl bg-bg-elevated"
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{sessions.map((session) => (
					<SessionDiscoveryCard
						key={session.id}
						session={session}
						variant="grid"
						{...(onJoinSession ? { onJoin: onJoinSession } : {})}
						className={
							session.status === "active" ? "sm:col-span-2 xl:col-span-1" : ""
						}
					/>
				))}
			</div>
		</div>
	);
}
