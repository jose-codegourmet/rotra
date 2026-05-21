import { addProfileTag, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminActorProfileId } from "@/lib/admin-actor";
import { AdminSessionError } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	jsonCustomerProfileDetail,
	notifyCustomerProfileChangedWithNames,
} from "../../route-helpers";

export const runtime = "nodejs";

const tagBodySchema = z.object({
	label: z.string().min(1).max(60),
});

export async function POST(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = tagBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const actorId = await getAdminActorProfileId();
		const label = parsed.data.label;
		await addProfileTag(db, {
			profileId: id,
			label,
			assignedBy: actorId,
		});
		await notifyCustomerProfileChangedWithNames(db, {
			actorProfileId: actorId,
			customerProfileId: id,
			title: "Customer tag added",
			bodyTemplate: (actorName, customerName) =>
				`${actorName} added tag "${label}" to ${customerName}.`,
		});
		return jsonCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return customerProfileErrorResponse(error, "[customers tags POST]");
	}
}
