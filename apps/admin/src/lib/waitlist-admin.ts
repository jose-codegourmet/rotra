import { db } from "@rotra/db";

import {
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	type WaitlistApiResponse,
	type WaitlistStatsResponse,
} from "./waitlist-shared";

export {
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	WAITLIST_INITIAL_PAGE_INDEX,
	WAITLIST_INITIAL_PAGE_SIZE,
	type WaitlistApiResponse,
	type WaitlistApiRow,
	type WaitlistStatsResponse,
	waitlistQueryKeys,
} from "./waitlist-shared";

export async function loadWaitlistPage(
	pageIndex: number,
	rawPageSize: number,
): Promise<WaitlistApiResponse> {
	const pageSize = Math.min(
		MAX_PAGE_SIZE,
		Math.max(1, Number.isFinite(rawPageSize) ? rawPageSize : DEFAULT_PAGE_SIZE),
	);
	const safeIndex = Math.max(0, Math.floor(pageIndex));
	const page = safeIndex + 1;
	const skip = safeIndex * pageSize;

	const [rows, total] = await Promise.all([
		db.waitlistSignup.findMany({
			skip,
			take: pageSize,
			orderBy: { createdAt: "desc" },
			select: { id: true, email: true, createdAt: true },
		}),
		db.waitlistSignup.count(),
	]);

	return {
		rows: rows.map((r) => ({
			id: r.id,
			email: r.email,
			createdAt: r.createdAt.toISOString(),
		})),
		total,
		page,
		pageSize,
	};
}

export async function loadWaitlistStats(): Promise<WaitlistStatsResponse> {
	const now = Date.now();
	const ms24h = 24 * 60 * 60 * 1000;
	const ms7d = 7 * ms24h;
	const ms30d = 30 * ms24h;

	const [total, last24h, last7d, last30d] = await Promise.all([
		db.waitlistSignup.count(),
		db.waitlistSignup.count({
			where: { createdAt: { gte: new Date(now - ms24h) } },
		}),
		db.waitlistSignup.count({
			where: { createdAt: { gte: new Date(now - ms7d) } },
		}),
		db.waitlistSignup.count({
			where: { createdAt: { gte: new Date(now - ms30d) } },
		}),
	]);

	return { total, last24h, last7d, last30d };
}
