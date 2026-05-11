import { addProfileTag, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminActorProfileId } from "@/lib/admin-actor";
import { AdminSessionError } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	jsonCustomerProfileDetail,
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
		await addProfileTag(db, {
			profileId: id,
			label: parsed.data.label,
			assignedBy: actorId,
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
