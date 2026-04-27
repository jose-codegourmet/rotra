import {
	type ApplicationRejectionReason,
	ClubApplicationError,
	db,
	rejectClubApplication,
} from "@rotra/db";
import { NextResponse } from "next/server";

import { getAdminActorProfileId } from "@/lib/admin-actor";

export const runtime = "nodejs";

const REJECTION_REASONS: ApplicationRejectionReason[] = [
	"insufficient_information",
	"unverifiable_venue",
	"unverifiable_contact",
	"duplicate_or_squatting",
	"policy_violation",
	"spam_or_low_quality",
	"applicant_history",
	"other",
];

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

	let body: { reason?: string; reviewNote?: string | null };
	try {
		body = (await request.json()) as {
			reason?: string;
			reviewNote?: string | null;
		};
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const reason = body.reason as ApplicationRejectionReason | undefined;
	if (!reason || !REJECTION_REASONS.includes(reason)) {
		return NextResponse.json(
			{ error: "Field `reason` must be a valid application rejection code." },
			{ status: 400 },
		);
	}

	try {
		await rejectClubApplication(db, {
			applicationId: id,
			adminProfileId: adminId,
			reason,
			...(body.reviewNote != null && body.reviewNote !== ""
				? { reviewNote: body.reviewNote }
				: {}),
		});
		return NextResponse.json({ ok: true });
	} catch (e) {
		if (e instanceof ClubApplicationError) {
			const status = e.code === "not_found" ? 404 : 409;
			return NextResponse.json({ error: e.message }, { status });
		}
		console.error("[admin club-applications reject]", e);
		return NextResponse.json(
			{ error: "Failed to reject application." },
			{ status: 500 },
		);
	}
}
