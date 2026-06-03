import { db, revokeTesterInvitation, type TesterAuthAdmin } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	deleteAdminAuthUser,
	inviteTesterAuthUser,
} from "@/lib/supabase/admin";
import { testerErrorResponse } from "../../route-helpers";

export const runtime = "nodejs";

function buildTesterAuthAdmin(): TesterAuthAdmin {
	return {
		inviteUserByEmail: async (email, options) => {
			const { userId } = await inviteTesterAuthUser({
				email,
				name: String(options.data.name ?? ""),
				testerPassword: String(options.data.tester_password ?? ""),
				redirectTo: options.redirectTo,
			});
			return { userId };
		},
		deleteUser: deleteAdminAuthUser,
	};
}

export async function POST(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		const session = await requireAdminSession();
		await revokeTesterInvitation(db, buildTesterAuthAdmin(), {
			actorProfileId: session.profileId,
			profileId: id,
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		return testerErrorResponse(error, "[testers revoke POST]");
	}
}
