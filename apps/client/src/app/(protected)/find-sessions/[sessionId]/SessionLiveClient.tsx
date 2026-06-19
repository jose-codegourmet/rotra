"use client";

import { SessionLiveTabs } from "@/components/modules/session";
import { useSessionLive } from "@/hooks/useSessionLive";

export interface SessionLiveClientProps {
	sessionId: string;
}

export function SessionLiveClient({ sessionId }: SessionLiveClientProps) {
	const { data: sessionLive } = useSessionLive(sessionId);

	if (!sessionLive) {
		return null;
	}

	return (
		<div className="max-w-[1100px] mx-auto p-4 md:p-8">
			<SessionLiveTabs
				sessionLabel={sessionLive.sessionLabel}
				sessionId={sessionLive.sessionId}
				isOwner={sessionLive.isOwner}
				sessionTitle={sessionLive.sessionTitle}
			/>
		</div>
	);
}
