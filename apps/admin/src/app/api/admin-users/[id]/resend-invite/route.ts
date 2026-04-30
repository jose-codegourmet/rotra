import { db, resendAdminInvite } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { sendAdminPasswordResetLink } from "@/lib/supabase/admin";
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
			select: { email: true },
		});
		if (target?.email) {
			const callbackUrl = new URL(
				"/auth/callback?next=/set-password",
				request.url,
			);
			await sendAdminPasswordResetLink(target.email, callbackUrl.toString());
		}
		return NextResponse.json({ ok: true });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users resend-invite]");
	}
}
