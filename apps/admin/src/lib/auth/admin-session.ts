import { db } from "@rotra/db";
import { createClient } from "@/lib/supabase/server";

export class AdminSessionError extends Error {
	constructor(
		public readonly status: 401 | 403,
		message: string,
	) {
		super(message);
		this.name = "AdminSessionError";
	}
}

function hasAdminRole(user: {
	app_metadata?: unknown;
	user_metadata?: unknown;
}): boolean {
	const appRole =
		typeof user.app_metadata === "object" && user.app_metadata
			? (user.app_metadata as Record<string, unknown>).role
			: null;
	const userRole =
		typeof user.user_metadata === "object" && user.user_metadata
			? (user.user_metadata as Record<string, unknown>).role
			: null;
	return appRole === "admin" || userRole === "admin";
}

export async function requireAdminSession() {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new AdminSessionError(401, "Unauthorized");
	}
	if (!hasAdminRole(user)) {
		throw new AdminSessionError(403, "Admin access required");
	}

	const profile = await db.profile.findUnique({
		where: { id: user.id },
		select: {
			id: true,
			name: true,
			email: true,
			adminRole: true,
			adminIsActive: true,
		},
	});
	if (!profile?.id || !profile.email) {
		throw new AdminSessionError(403, "Admin profile is not provisioned");
	}
	if (!profile.adminRole) {
		throw new AdminSessionError(403, "Admin role is not provisioned");
	}
	if (!profile.adminIsActive) {
		throw new AdminSessionError(403, "Admin account is inactive");
	}

	return {
		profileId: profile.id,
		name: profile.name,
		email: profile.email,
		adminRole: profile.adminRole,
		adminIsActive: profile.adminIsActive,
	};
}
