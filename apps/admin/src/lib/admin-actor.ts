/**
 * Profile id used for `admin_action_log.admin_id` on admin writes.
 * Prefer a real `profiles.id` UUID from your environment or from the request header in dev.
 */
export function getAdminActorProfileId(request: Request): string | null {
	const header = request.headers.get("x-rotra-admin-profile-id")?.trim();
	if (header) return header;
	return process.env.ROTRA_ADMIN_ACTOR_PROFILE_ID?.trim() ?? null;
}
