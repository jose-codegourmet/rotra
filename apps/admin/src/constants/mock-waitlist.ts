import type {
	WaitlistApiRow,
	WaitlistStatsResponse,
} from "@/lib/waitlist-admin";

export const MOCK_WAITLIST_STATS: WaitlistStatsResponse = {
	total: 124,
	last24h: 3,
	last7d: 18,
	last30d: 45,
};

/** Enough rows to exercise pagination at pageSize 10 (second page). */
export const MOCK_WAITLIST_ROWS: WaitlistApiRow[] = Array.from(
	{ length: 24 },
	(_, i) => ({
		id: `mock-${i + 1}`,
		email: `player${i + 1}@example.com`,
		createdAt: new Date(
			Date.UTC(2026, 3, 19 - (i % 14), 12 + (i % 8), 30),
		).toISOString(),
	}),
);

export const MOCK_WAITLIST_TOTAL = MOCK_WAITLIST_ROWS.length;
