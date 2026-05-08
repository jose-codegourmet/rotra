import { AdminUserError, db, resendAdminInvite } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	resolveAdminAppOrigin,
	sendAdminInviteEmail,
} from "@/lib/supabase/admin";
import { adminUserErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

export async function POST(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	try {
		const session = await requireAdminSession();
		await resendAdminInvite(db, {
			actorProfileId: session.profileId,
			targetProfileId: id,
		});
		const target = await db.profile.findUnique({
			where: { id },
			select: { email: true, name: true, adminRole: true, adminIsActive: true },
		});
		if (!target?.adminRole) {
			throw new AdminUserError("not_found", "Admin user not found.");
		}
		if (target.adminIsActive) {
			throw new AdminUserError(
				"bad_state",
				"Cannot resend an invite to an active admin.",
			);
		}

		const email = target.email?.trim().toLowerCase() ?? "";
		if (!email) {
			throw new AdminUserError(
				"bad_state",
				"Cannot resend an invite without an admin email.",
			);
		}

		const name = target.name?.trim() ?? "";
		if (!name) {
			throw new AdminUserError(
				"bad_input",
				"Cannot resend an invite without an admin name.",
			);
		}

		const redirectTo = resolveAdminAppOrigin(request);
		await sendAdminInviteEmail({
			email,
			name,
			role: target.adminRole,
			redirectTo,
		});
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users resend-invite]");
	}
}
