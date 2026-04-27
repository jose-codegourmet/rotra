import { approveClubApplication, ClubApplicationError, db } from "@rotra/db";
import { NextResponse } from "next/server";

import { getAdminActorProfileId } from "@/lib/admin-actor";

export const runtime = "nodejs";

export async function POST(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;
	const adminId = getAdminActorProfileId(request);
	if (!adminId) {
		return NextResponse.json(
			{
				error:
					"Missing admin actor: set header X-Rotra-Admin-Profile-Id or env ROTRA_ADMIN_ACTOR_PROFILE_ID.",
			},
			{ status: 400 },
		);
	}

	try {
		const result = await approveClubApplication(db, {
			applicationId: id,
			adminProfileId: adminId,
		});
		return NextResponse.json({
			clubId: result.clubId,
			applicationId: result.application.id,
		});
	} catch (e) {
		if (e instanceof ClubApplicationError) {
			const status = e.code === "not_found" ? 404 : 409;
			return NextResponse.json({ error: e.message }, { status });
		}
		console.error("[admin club-applications approve]", e);
		return NextResponse.json(
			{ error: "Failed to approve application." },
			{ status: 500 },
		);
	}
}
