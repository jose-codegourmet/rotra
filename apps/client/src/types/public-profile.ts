/** JSON returned by `GET /api/profile/[userId]` (serializable). */
export type PublicProfileDto = {
	id: string;
	name: string;
	avatarUrl: string | null;
	playingLevel: string | null;
	formatPreference: string | null;
	courtPosition: string | null;
	playMode: string | null;
	mmr: number;
	expTotal: number;
	onboardingCompleted: boolean;
	createdAt: string;
	updatedAt: string;
};
