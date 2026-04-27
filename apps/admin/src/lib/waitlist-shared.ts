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
