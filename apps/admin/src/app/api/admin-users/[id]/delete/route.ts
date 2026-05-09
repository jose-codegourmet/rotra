import { db, deleteAdminUser } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { deleteAdminAuthUser } from "@/lib/supabase/admin";
import { adminUserErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

export async function POST(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	try {
		const session = await requireAdminSession();
		const { auditLogId } = await deleteAdminUser(db, {
			actorProfileId: session.profileId,
			targetProfileId: id,
			foundingSuperAdminId: process.env.FOUNDING_SUPER_ADMIN_ID ?? null,
		});
		try {
			await deleteAdminAuthUser(id);
		} catch (err) {
			await db.adminActionLog
				.delete({ where: { id: auditLogId } })
				.catch(() => undefined);
			throw err;
		}
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users delete]");
	}
}
