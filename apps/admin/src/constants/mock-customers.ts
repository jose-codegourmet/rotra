import type {
	CustomerDirectoryRowSerialized,
	ListCustomersResponse,
} from "@/hooks/useCustomers/server";

/** Storybook + UI fixtures only — not used at runtime for production data */
export const MOCK_CUSTOMER_ROWS: CustomerDirectoryRowSerialized[] = [
	{
		id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		name: "Alex Player",
		email: "alex@example.com",
		avatarUrl: null,
		isVerified: true,
		mmr: 1240,
		createdAt: "2025-01-15T12:00:00.000Z",
	},
	{
		id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
		name: "Jordan Lee",
		email: "jordan@example.com",
		avatarUrl: null,
		isVerified: false,
		mmr: 1010,
		createdAt: "2025-02-20T08:30:00.000Z",
	},
];

export const MOCK_CUSTOMERS_LIST_RESPONSE: ListCustomersResponse = {
	rows: MOCK_CUSTOMER_ROWS,
	page: 1,
	pageSize: 25,
	total: MOCK_CUSTOMER_ROWS.length,
	hasMore: false,
};
