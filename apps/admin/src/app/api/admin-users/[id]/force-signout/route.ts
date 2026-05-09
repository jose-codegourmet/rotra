import { db, forceSignOutAdminUser } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { adminUserErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

export async function POST(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	try {
		const session = await requireAdminSession();
		await forceSignOutAdminUser(db, {
			actorProfileId: session.profileId,
			targetProfileId: id,
		});
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users force-signout]");
	}
}
