import type { User as AuthUser } from "@supabase/supabase-js";

export function displayNameFromAuthUser(user: AuthUser): string {
	const meta = user.user_metadata as Record<string, unknown>;
	const full = meta.full_name ?? meta.name;
	if (typeof full === "string" && full.trim()) {
		return full.trim();
	}
	if (user.email) {
		return user.email;
	}
	return "Player";
}

export function avatarUrlFromAuthUser(user: AuthUser): string | null {
	const meta = user.user_metadata as Record<string, unknown>;
	const avatar = meta.avatar_url ?? meta.picture;
	if (typeof avatar === "string" && avatar.startsWith("http")) {
		return avatar;
	}
	if (
		avatar &&
		typeof avatar === "object" &&
		avatar !== null &&
		"url" in avatar &&
		typeof (avatar as { url: string }).url === "string"
	) {
		const u = (avatar as { url: string }).url;
		return u.startsWith("http") ? u : null;
	}
	return null;
}
