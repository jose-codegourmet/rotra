import { db } from "@rotra/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

export type WaitlistApiRow = {
	id: string;
	email: string;
	createdAt: string;
};

export type WaitlistApiResponse = {
	rows: WaitlistApiRow[];
	total: number;
	page: number;
	pageSize: number;
};

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

	const skip = (page - 1) * pageSize;

	try {
		const [rows, total] = await Promise.all([
			db.waitlistSignup.findMany({
				skip,
				take: pageSize,
				orderBy: { createdAt: "desc" },
				select: { id: true, email: true, createdAt: true },
			}),
			db.waitlistSignup.count(),
		]);

		const body: WaitlistApiResponse = {
			rows: rows.map((r) => ({
				id: r.id,
				email: r.email,
				createdAt: r.createdAt.toISOString(),
			})),
			total,
			page,
			pageSize,
		};

		return NextResponse.json(body);
	} catch (e) {
		console.error("[admin waitlist GET]", e);
		return NextResponse.json(
			{ error: "Failed to load waitlist." },
			{ status: 500 },
		);
	}
}
