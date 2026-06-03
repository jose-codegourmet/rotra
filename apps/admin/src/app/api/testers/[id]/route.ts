import { db } from "@rotra/db";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { jsonTesterProfileDetail, testerErrorResponse } from "../route-helpers";

export const runtime = "nodejs";

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		await requireAdminSession();
		return jsonTesterProfileDetail(db, id);
	} catch (error) {
		return testerErrorResponse(error, "[testers detail GET]");
	}
}
