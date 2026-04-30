import { db, deactivateAdminUser } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { revokeAdminUserSessions } from "@/lib/supabase/admin";
import { adminUserErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

export async function POST(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	try {
		const session = await requireAdminSession();
		await deactivateAdminUser(db, {
			actorProfileId: session.profileId,
			targetProfileId: id,
			foundingSuperAdminId: process.env.FOUNDING_SUPER_ADMIN_ID ?? null,
		});
		await revokeAdminUserSessions(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users deactivate]");
	}
}
