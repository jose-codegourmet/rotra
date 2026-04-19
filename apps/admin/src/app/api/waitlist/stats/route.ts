import { NextResponse } from "next/server";
import {
	loadWaitlistStats,
	type WaitlistStatsResponse,
} from "@/lib/waitlist-admin";

export const runtime = "nodejs";

export type { WaitlistStatsResponse } from "@/lib/waitlist-admin";

export async function GET() {
	try {
		const body: WaitlistStatsResponse = await loadWaitlistStats();
		return NextResponse.json(body);
	} catch (e) {
		console.error("[admin waitlist stats GET]", e);
		return NextResponse.json(
			{ error: "Failed to load waitlist statistics." },
			{ status: 500 },
		);
	}
}
