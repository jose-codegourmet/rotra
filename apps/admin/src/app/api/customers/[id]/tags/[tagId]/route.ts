import { db, removeProfileTag } from "@rotra/db";
import { NextResponse } from "next/server";
import { getAdminActorProfileId } from "@/lib/admin-actor";
import { AdminSessionError } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	jsonCustomerProfileDetail,
	notifyCustomerProfileChangedWithNames,
} from "../../../route-helpers";

export const runtime = "nodejs";

export async function DELETE(
	_req: Request,
	context: { params: Promise<{ id: string; tagId: string }> },
) {
	const { id, tagId } = await context.params;

	try {
		const actorId = await getAdminActorProfileId();
		await removeProfileTag(db, { profileId: id, tagId });
		await notifyCustomerProfileChangedWithNames(db, {
			actorProfileId: actorId,
			customerProfileId: id,
			title: "Customer tag removed",
			bodyTemplate: (actorName, customerName) =>
				`${actorName} removed a tag from ${customerName}.`,
		});
		return jsonCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return customerProfileErrorResponse(error, "[customers tags DELETE]");
	}
}
