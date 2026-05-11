import {
	CourtPosition,
	FormatPreference,
	PlayingLevel,
	PlayMode,
} from "@prisma/client";
import { db, updateCustomerSkills } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminActorProfileId } from "@/lib/admin-actor";
import { AdminSessionError } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	jsonCustomerProfileDetail,
} from "../../route-helpers";

export const runtime = "nodejs";

const skillsBodySchema = z.object({
	playingLevel: z.nativeEnum(PlayingLevel).nullable(),
	formatPreference: z.nativeEnum(FormatPreference).nullable(),
	courtPosition: z.nativeEnum(CourtPosition).nullable(),
	playMode: z.nativeEnum(PlayMode).nullable(),
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

	const parsed = skillsBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		await getAdminActorProfileId();
		await updateCustomerSkills(db, {
			profileId: id,
			playingLevel: parsed.data.playingLevel,
			formatPreference: parsed.data.formatPreference,
			courtPosition: parsed.data.courtPosition,
			playMode: parsed.data.playMode,
		});
		return jsonCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		return customerProfileErrorResponse(error, "[customers skills PATCH]");
	}
}
