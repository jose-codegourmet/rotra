/**
 * Base URL for the player client app (e.g. https://app.rotra.example).
 * Used to build external links from the admin app (e.g. View profile).
 */
export function getClientAppOrigin(): string | null {
	const raw = process.env.NEXT_PUBLIC_CLIENT_APP_ORIGIN?.trim();
	if (!raw) return null;
	return raw.replace(/\/$/, "");
}

export function playerProfileUrl(playerId: string): string | null {
	const base = getClientAppOrigin();
	if (!base) return null;
	return `${base}/profile/${encodeURIComponent(playerId)}`;
}
