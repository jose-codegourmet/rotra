import { db, expireStalePendingClubApplications } from "@rotra/db";
import { NextResponse } from "next/server";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function POST(_request: Request) {
	try {
		const admin = await requireAdminSession();
		const result = await expireStalePendingClubApplications(
			db,
			admin.profileId,
		);
		return NextResponse.json(result);
	} catch (e) {
		if (e instanceof AdminSessionError) {
			return NextResponse.json({ error: e.message }, { status: e.status });
		}
		console.error("[cron club-applications-sla]", e);
		const message = e instanceof Error ? e.message : "SLA job failed.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
