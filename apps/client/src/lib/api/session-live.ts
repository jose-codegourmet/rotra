import { db } from "@rotra/db";

import type { SessionLiveContext } from "@/types/session-live";

function toSessionLiveContext(
	session: {
		id: string;
		hostId: string;
		title: string | null;
		location: string;
	},
	profileId: string,
): SessionLiveContext {
	const sessionLabel =
		session.title?.trim() || session.location.trim() || "Live session";

	return {
		sessionId: session.id,
		title: session.title,
		location: session.location,
		isOwner: session.hostId === profileId,
		sessionLabel,
		sessionTitle: session.title ?? session.location,
	};
}

export async function getSessionLiveContext(
	sessionId: string,
	profileId: string,
): Promise<SessionLiveContext | null> {
	const session = await db.queueSession.findUnique({
		where: { id: sessionId },
		select: {
			id: true,
			hostId: true,
			title: true,
			location: true,
		},
	});

	if (!session) {
		return null;
	}

	return toSessionLiveContext(session, profileId);
}
