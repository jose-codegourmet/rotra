import { requireAdminSession } from "@/lib/auth/admin-session";

/**
 * Profile id used for `admin_action_log.admin_id` on admin writes.
 * Resolved from the authenticated admin session and linked profile.
 */
export async function getAdminActorProfileId(): Promise<string> {
	const admin = await requireAdminSession();
	return admin.profileId;
}
