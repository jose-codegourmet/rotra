import { db, inviteAdminUser } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { inviteAdminAuthUser } from "@/lib/supabase/admin";
import { adminUserErrorResponse, parseAdminRole } from "../route-helpers";

export const runtime = "nodejs";

type InviteBody = {
	name?: string;
	email?: string;
	role?: string;
};

export async function POST(request: Request) {
	let body: InviteBody;
	try {
		body = (await request.json()) as InviteBody;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const name = body.name?.trim() ?? "";
	const email = body.email?.trim().toLowerCase() ?? "";
	const role = parseAdminRole(body.role);
	if (!name || !email || !role) {
		return NextResponse.json(
			{ error: "Fields `name`, `email`, and `role` are required." },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		const callbackUrl = new URL(
			"/auth/callback?next=/set-password",
			request.url,
		);
		const { userId } = await inviteAdminAuthUser({
			email,
			name,
			redirectTo: callbackUrl.toString(),
		});
		const result = await inviteAdminUser(db, {
			actorProfileId: session.profileId,
			authUserId: userId,
			name,
			email,
			role,
		});
		return NextResponse.json({
			ok: true,
			profileId: result.profileId,
			invitationId: result.invitationId,
		});
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users invite]");
	}
}
