import { db, listAdminUsers } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { adminUserErrorResponse } from "./route-helpers";

export const runtime = "nodejs";

export async function GET() {
	try {
		const session = await requireAdminSession();
		const users = await listAdminUsers(db);
		return NextResponse.json({
			users,
			actor: {
				profileId: session.profileId,
				adminRole: session.adminRole,
			},
		});
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users list]");
	}
}
