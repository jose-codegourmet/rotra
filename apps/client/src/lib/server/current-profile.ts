import { db, Prisma } from "@rotra/db";
import type { User } from "@supabase/supabase-js";

import {
	avatarUrlFromAuthUser,
	displayNameFromAuthUser,
	facebookIdFromAuthUser,
} from "@/lib/auth/supabase-user-display";
import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = {
	id: string;
	name: string;
	phone: string | null;
	onboardingCompleted: boolean;
	createdAt: Date;
};

const profileSelect = {
	id: true,
	name: true,
	phone: true,
	onboardingCompleted: true,
	createdAt: true,
} as const;

/**
 * Create a `profiles` row for a Supabase user when the DB trigger did not run.
 * `facebook_id` is required; we use provider metadata, with a last-resort
 * unique placeholder so the app can function (log in dev for follow-up).
 */
async function ensureProfileRow(user: User) {
	const fromMeta = facebookIdFromAuthUser(user);
	const facebookId = fromMeta ?? `fallback_${user.id}`;
	if (!fromMeta && process.env.NODE_ENV === "development") {
		// c8: real signups should always have provider_id
		console.warn(
			"[getCurrentProfile] Missing Facebook provider_id; using fallback facebook_id.",
		);
	}

	const name = displayNameFromAuthUser({ user });
	const avatarUrl = avatarUrlFromAuthUser(user);

	try {
		await db.profile.create({
			data: {
				id: user.id,
				facebookId,
				name,
				avatarUrl,
				email: user.email ?? null,
			},
		});
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2002"
		) {
			const byId = await db.profile.findUnique({
				where: { id: user.id },
				select: profileSelect,
			});
			if (byId) return byId;
			const byFb = await db.profile.findUnique({
				where: { facebookId },
				select: profileSelect,
			});
			if (byFb) return byFb;
		}
		throw e;
	}

	const row = await db.profile.findUnique({
		where: { id: user.id },
		select: profileSelect,
	});
	if (!row) {
		throw new Error("Profile insert succeeded but row was not found.");
	}
	return row;
}

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
			select: profileSelect,
		});
		return p;
	}

	let supabase: Awaited<ReturnType<typeof createClient>>;
	try {
		supabase = await createClient();
	} catch {
		return null;
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	let profile = await db.profile.findUnique({
		where: { id: user.id },
		select: profileSelect,
	});
	if (profile) return profile;

	try {
		profile = await ensureProfileRow(user);
		return profile;
	} catch (err) {
		console.error("[getCurrentProfile] ensureProfileRow:", err);
		return null;
	}
}
