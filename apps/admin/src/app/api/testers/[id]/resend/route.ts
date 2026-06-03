import { db, resendTesterInvite, type TesterAuthAdmin } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { getClientAppOrigin } from "@/lib/client-app-url";
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
		const clientAppOrigin = getClientAppOrigin();
		if (!clientAppOrigin) {
			return NextResponse.json(
				{ error: "NEXT_PUBLIC_CLIENT_APP_ORIGIN is not configured." },
				{ status: 503 },
			);
		}

		const result = await resendTesterInvite(db, buildTesterAuthAdmin(), {
			actorProfileId: session.profileId,
			profileId: id,
			clientAppOrigin,
		});

		return NextResponse.json({
			ok: true,
			invitationId: result.invitationId,
		});
	} catch (error) {
		return testerErrorResponse(error, "[testers resend POST]");
	}
}
