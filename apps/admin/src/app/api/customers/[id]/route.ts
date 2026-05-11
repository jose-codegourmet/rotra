import { db, getCustomerProfileDetail } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	serializeCustomerProfileDetail,
} from "../route-helpers";

export const runtime = "nodejs";

export async function GET(
	_req: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		await requireAdminSession();
		const { id } = await context.params;
		const detail = await getCustomerProfileDetail(db, id);
		return NextResponse.json({
			profile: serializeCustomerProfileDetail(detail),
		});
	} catch (error) {
		return customerProfileErrorResponse(error, "[customers detail]");
	}
}
