import { db, updateCustomerIdentity } from "@rotra/db";
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

const identityBodySchema = z.object({
	name: z.string().min(1).max(200),
	email: z
		.union([z.string().email(), z.literal("")])
		.nullable()
		.optional()
		.transform((v) => (v === "" || v == null ? null : v)),
	phone: z
		.union([z.string().min(1).max(40), z.literal("")])
		.nullable()
		.optional()
		.transform((v) => (v === "" || v == null ? null : v)),
});

export async function PATCH(
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

	const parsed = identityBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const actorId = await getAdminActorProfileId();
		await updateCustomerIdentity(db, {
			profileId: id,
			name: parsed.data.name,
			email: parsed.data.email ?? null,
			phone: parsed.data.phone ?? null,
		});
		await notifyCustomerProfileChangedWithNames(db, {
			actorProfileId: actorId,
			customerProfileId: id,
			title: "Customer identity updated",
			bodyTemplate: (actorName, customerName) =>
				`${actorName} updated contact info for ${customerName}.`,
		});
		return jsonCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return customerProfileErrorResponse(error, "[customers identity PATCH]");
	}
}
