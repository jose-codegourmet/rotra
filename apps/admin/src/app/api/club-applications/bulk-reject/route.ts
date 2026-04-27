import type { ApplicationRejectionReason } from "@rotra/db";
import { bulkRejectClubApplications, db } from "@rotra/db";
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

export async function POST(request: Request) {
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

	let body: {
		applicationIds?: string[];
		reason?: string;
		reviewNote?: string | null;
	};
	try {
		body = (await request.json()) as typeof body;
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const ids = body.applicationIds;
	if (!Array.isArray(ids) || ids.length === 0) {
		return NextResponse.json(
			{ error: "Field `applicationIds` must be a non-empty array." },
			{ status: 400 },
		);
	}

	const reason = body.reason as ApplicationRejectionReason | undefined;
	if (!reason || !REJECTION_REASONS.includes(reason)) {
		return NextResponse.json(
			{ error: "Field `reason` must be a valid application rejection code." },
			{ status: 400 },
		);
	}

	const results = await bulkRejectClubApplications(db, {
		applicationIds: ids,
		adminProfileId: adminId,
		reason,
		...(body.reviewNote != null && body.reviewNote !== ""
			? { reviewNote: body.reviewNote }
			: {}),
	});

	return NextResponse.json({ results });
}
