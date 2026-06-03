import { addProfileTag, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	jsonCustomerProfileDetail,
	notifyCustomerProfileChangedWithNames,
} from "../../route-helpers";

export const runtime = "nodejs";

const tagBodySchema = z.object({
	slug: z.string().min(1).max(80),
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
		const session = await requireAdminSession();
		const slug = parsed.data.slug;
		await addProfileTag(db, {
			profileId: id,
			slug,
			assignedBy: session.profileId,
			callerRole: session.adminRole,
		});
		await notifyCustomerProfileChangedWithNames(db, {
			actorProfileId: session.profileId,
			customerProfileId: id,
			title: "Customer tag added",
			bodyTemplate: (actorName, customerName) =>
				`${actorName} added tag "${slug}" to ${customerName}.`,
		});
		return jsonCustomerProfileDetail(db, id);
	} catch (error) {
		return customerProfileErrorResponse(error, "[customers tags POST]");
	}
}
