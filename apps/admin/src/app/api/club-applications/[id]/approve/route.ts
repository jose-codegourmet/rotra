import { approveClubApplication, ClubApplicationError, db } from "@rotra/db";
import { NextResponse } from "next/server";
import { getAdminActorProfileId } from "@/lib/admin-actor";
import { AdminSessionError } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function POST(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		const adminId = await getAdminActorProfileId();
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
		if (e instanceof AdminSessionError) {
			return NextResponse.json({ error: e.message }, { status: e.status });
		}
		console.error("[admin club-applications approve]", e);
		return NextResponse.json(
			{ error: "Failed to approve application." },
			{ status: 500 },
		);
	}
}
