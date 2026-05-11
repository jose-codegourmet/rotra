import type { CustomerProfileDetail } from "@rotra/db";

/** JSON-safe customer profile for Server Component → Client Component props. */
export type CustomerProfileSerialized = Omit<
	CustomerProfileDetail,
	"createdAt" | "updatedAt" | "tags"
> & {
	createdAt: string;
	updatedAt: string;
	tags: Array<{
		id: string;
		slug: string;
		label: string;
		assignedAt: string;
	}>;
};

export function serializeCustomerProfileForClient(
	detail: CustomerProfileDetail,
): CustomerProfileSerialized {
	return {
		...detail,
		createdAt: detail.createdAt.toISOString(),
		updatedAt: detail.updatedAt.toISOString(),
		tags: detail.tags.map((t) => ({
			...t,
			assignedAt: t.assignedAt.toISOString(),
		})),
	};
}
