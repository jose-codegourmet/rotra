import { db, getAdminUserDetail } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { adminUserErrorResponse } from "../route-helpers";

export const runtime = "nodejs";

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	try {
		await requireAdminSession();
		const detail = await getAdminUserDetail(db, id);
		return NextResponse.json(detail);
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users detail]");
	}
}
