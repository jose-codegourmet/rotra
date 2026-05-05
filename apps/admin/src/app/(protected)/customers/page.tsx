import { db, listCustomerProfiles } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

import { CustomersDirectoryClient } from "@/components/modules/customers/customers-directory-client/CustomersDirectoryClient";
import {
	type CustomersQueryFilters,
	customersQueryKey,
} from "@/hooks/useCustomers/queryKey";
import type { ListCustomersResponse } from "@/hooks/useCustomers/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

const DEFAULT_FILTERS: CustomersQueryFilters = {
	q: "",
	page: 1,
	limit: 25,
};

export default async function CustomersPage() {
	await requireAdminSession();

	const result = await listCustomerProfiles(db, {
		page: DEFAULT_FILTERS.page,
		limit: DEFAULT_FILTERS.limit,
	});

	const initialList: ListCustomersResponse = {
		...result,
		rows: result.rows.map((row) => ({
			...row,
			createdAt: row.createdAt.toISOString(),
		})),
	};

	const queryClient = new QueryClient();
	queryClient.setQueryData(customersQueryKey(DEFAULT_FILTERS), initialList);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CustomersDirectoryClient
				initialFilters={DEFAULT_FILTERS}
				initialList={initialList}
			/>
		</HydrationBoundary>
	);
}
