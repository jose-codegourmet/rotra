import { db } from "@rotra/db";

export type CurrentProfile = {
	id: string;
	name: string;
	phone: string | null;
	onboardingCompleted: boolean;
	createdAt: Date;
};

/**
 * Resolves the signed-in player profile for server layouts and API routes.
 * Returns null when auth is not wired (no redirects) or when there is no session.
 *
 * Optional dev override: set `ROTRA_DEV_PROFILE_ID` to a profiles.id UUID to
 * load that row from the database (requires DATABASE_URL).
 */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
	const devId = process.env.ROTRA_DEV_PROFILE_ID?.trim();
	if (devId) {
		const p = await db.profile.findUnique({
			where: { id: devId },
			select: {
				id: true,
				name: true,
				phone: true,
				onboardingCompleted: true,
				createdAt: true,
			},
		});
		return p;
	}
	return null;
}
