import { NextResponse } from "next/server";
import {
	DEFAULT_PAGE_SIZE,
	loadWaitlistPage,
	MAX_PAGE_SIZE,
	type WaitlistApiResponse,
} from "@/lib/waitlist-admin";

export const runtime = "nodejs";

export type { WaitlistApiResponse, WaitlistApiRow } from "@/lib/waitlist-admin";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const page = Math.max(
		1,
		Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
	);
	const rawSize = Number.parseInt(
		searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
		10,
	);
	const pageSize = Math.min(
		MAX_PAGE_SIZE,
		Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE),
	);

	const pageIndex = page - 1;

	try {
		const body: WaitlistApiResponse = await loadWaitlistPage(
			pageIndex,
			pageSize,
		);
		return NextResponse.json(body);
	} catch (e) {
		console.error("[admin waitlist GET]", e);
		return NextResponse.json(
			{ error: "Failed to load waitlist." },
			{ status: 500 },
		);
	}
}
