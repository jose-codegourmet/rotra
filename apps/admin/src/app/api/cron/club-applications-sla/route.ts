import { db, expireStalePendingClubApplications } from "@rotra/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST with `Authorization: Bearer <ROTRA_CRON_SECRET>` to auto-reject stale pending applications.
 */
export async function POST(request: Request) {
	const secret = process.env.ROTRA_CRON_SECRET?.trim();
	if (!secret) {
		return NextResponse.json(
			{ error: "ROTRA_CRON_SECRET is not configured." },
			{ status: 500 },
		);
	}

	const auth = request.headers.get("authorization")?.trim();
	const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
	if (token !== secret) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await expireStalePendingClubApplications(db);
		return NextResponse.json(result);
	} catch (e) {
		console.error("[cron club-applications-sla]", e);
		const message = e instanceof Error ? e.message : "SLA job failed.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
