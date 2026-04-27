import { db, type Prisma } from "@rotra/db";
import { NextResponse } from "next/server";

import { toClubApplicationListRowDto } from "@/lib/club-applications-admin-mapper";

export const runtime = "nodejs";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const APPLICATION_STATUSES = [
	"pending",
	"in_review",
	"approved",
	"rejected",
	"cancelled",
] as const;

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

	const statusParam = searchParams.get("status")?.trim();
	const sort = searchParams.get("sort")?.trim() ?? "newest";
	const playerIdParam = searchParams.get("playerId")?.trim();

	const statusWhere: Prisma.ClubApplicationWhereInput =
		statusParam &&
		(APPLICATION_STATUSES as readonly string[]).includes(statusParam)
			? { status: statusParam as (typeof APPLICATION_STATUSES)[number] }
			: {};

	const playerWhere: Prisma.ClubApplicationWhereInput =
		playerIdParam && isUuid(playerIdParam) ? { playerId: playerIdParam } : {};

	const where: Prisma.ClubApplicationWhereInput = {
		...statusWhere,
		...playerWhere,
	};

	const orderBy: Prisma.ClubApplicationOrderByWithRelationInput[] =
		sort === "sla"
			? [{ updatedAt: "asc" }]
			: sort === "oldest"
				? [{ createdAt: "asc" }]
				: [{ createdAt: "desc" }];

	const skip = (page - 1) * pageSize;

	try {
		const [total, rows] = await Promise.all([
			db.clubApplication.count({ where }),
			db.clubApplication.findMany({
				where,
				orderBy,
				skip,
				take: pageSize,
				include: {
					player: { select: { name: true, email: true } },
				},
			}),
		]);

		return NextResponse.json({
			rows: rows.map(toClubApplicationListRowDto),
			total,
			page,
			pageSize,
		});
	} catch (e) {
		console.error("[admin club-applications GET]", e);
		return NextResponse.json(
			{ error: "Failed to load applications." },
			{ status: 500 },
		);
	}
}

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
	return UUID_RE.test(s);
}
