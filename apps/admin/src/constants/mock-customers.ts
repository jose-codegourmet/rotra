import type {
	CustomerDirectoryRowSerialized,
	ListCustomersResponse,
} from "@/hooks/useCustomers/server";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

const MOCK_CUSTOMER_PROFILE_ID = "00000000-0000-4000-8000-000000000001";
const STABLE_CREATED_AT = "2025-01-01T00:00:00.000Z";
const STABLE_UPDATED_AT = "2025-02-01T12:00:00.000Z";

function mockCustomerProfile(
	overrides: Partial<CustomerProfileSerialized> = {},
): CustomerProfileSerialized {
	return {
		id: MOCK_CUSTOMER_PROFILE_ID,
		name: "Test Player",
		email: null,
		phone: null,
		avatarUrl: null,
		isVerified: false,
		emailVerified: false,
		mmr: 1000,
		mmrMatchesPlayed: 0,
		playingLevel: null,
		formatPreference: null,
		courtPosition: null,
		playMode: null,
		onboardingCompleted: false,
		expTotal: 0,
		tags: [],
		createdAt: STABLE_CREATED_AT,
		updatedAt: STABLE_UPDATED_AT,
		...overrides,
	};
}

/** Complete customer-detail fixture (basic info + skills stories share this). */
export const MOCK_CUSTOMER_PROFILE = mockCustomerProfile({
	email: "player@example.com",
	isVerified: true,
	emailVerified: true,
	mmr: 1200,
	mmrMatchesPlayed: 5,
	playingLevel: "intermediate",
	formatPreference: "doubles",
	courtPosition: "front",
	playMode: "competitive",
	onboardingCompleted: true,
	expTotal: 100,
});

export const MOCK_CUSTOMER_PROFILE_STATS = mockCustomerProfile({
	name: "Test",
	mmr: 1150,
	mmrMatchesPlayed: 12,
	expTotal: 250,
});

export const MOCK_CUSTOMER_PROFILE_VERIFICATION = mockCustomerProfile({
	email: "a@b.co",
	isVerified: true,
	emailVerified: true,
	onboardingCompleted: true,
});

export const MOCK_CUSTOMER_PROFILE_TAGS = mockCustomerProfile({
	tags: [
		{
			id: "00000000-0000-4000-8000-000000000099",
			slug: "beta-tester---scheduling",
			label: "beta tester - scheduling",
			assignedAt: STABLE_CREATED_AT,
		},
	],
});

export const MOCK_CUSTOMER_PROFILE_AUDIT = mockCustomerProfile({
	name: "Test",
});

export const MOCK_CUSTOMER_PROFILE_EDIT_SKILLS = mockCustomerProfile({
	playingLevel: "intermediate",
	formatPreference: "doubles",
	courtPosition: "front",
	playMode: "competitive",
});

export const MOCK_CUSTOMER_PROFILE_EDIT_BASIC_INFO = mockCustomerProfile({
	email: "player@example.com",
	phone: "+639171234567",
	isVerified: true,
	emailVerified: true,
	onboardingCompleted: true,
});

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
