import { changeAdminRole, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { revokeAdminUserSessions } from "@/lib/supabase/admin";
import { adminUserErrorResponse, parseAdminRole } from "../../route-helpers";

export const runtime = "nodejs";

export async function PATCH(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	let body: { role?: string };
	try {
		body = (await request.json()) as { role?: string };
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}
	const role = parseAdminRole(body.role);
	if (!role) {
		return NextResponse.json(
			{ error: "Field `role` must be `admin` or `super_admin`." },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		await changeAdminRole(db, {
			actorProfileId: session.profileId,
			targetProfileId: id,
			nextRole: role,
			foundingSuperAdminId: process.env.FOUNDING_SUPER_ADMIN_ID ?? null,
		});
		await revokeAdminUserSessions(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users role]");
	}
}
