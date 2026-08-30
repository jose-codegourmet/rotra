export const SESSION_STANDALONE_ROUTES = [
	"/sessions/join",
	"/sessions/joined",
	"/sessions/attendance",
	"/sessions/court",
	"/sessions/queue",
	"/sessions/add-match",
] as const;

export function isSessionStandaloneRoute(pathname: string | null): boolean {
	if (!pathname) return false;
	return (SESSION_STANDALONE_ROUTES as readonly string[]).includes(pathname);
}
