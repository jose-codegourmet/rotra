/** Shared with API route and client validation — keep in sync. */
export const WAITLIST_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidWaitlistEmail(raw: string): boolean {
	return WAITLIST_EMAIL_PATTERN.test(raw.trim());
}

export function normalizeWaitlistEmail(raw: string): string {
	return raw.trim().toLowerCase();
}
