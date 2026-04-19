import { db } from "@rotra/db";

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 20;
export const WAITLIST_INITIAL_PAGE_INDEX = 0;
export const WAITLIST_INITIAL_PAGE_SIZE = DEFAULT_PAGE_SIZE;

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

export type WaitlistStatsResponse = {
	total: number;
	last24h: number;
	last7d: number;
	last30d: number;
};

export const waitlistQueryKeys = {
	page: (pageIndex: number, pageSize: number) =>
		["admin", "waitlist", pageIndex, pageSize] as const,
	stats: () => ["admin", "waitlist", "stats"] as const,
};

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
