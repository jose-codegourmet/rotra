"use client";

import * as React from "react";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { CustomerDirectorySearchBar } from "@/components/modules/customers/customer-directory-search-bar/CustomerDirectorySearchBar";
import { CustomersTable } from "@/components/modules/customers/customers-table/CustomersTable";
import { Button } from "@/components/ui/button/Button";
import { useCustomersQuery } from "@/hooks/useCustomers/client";
import type { CustomersQueryFilters } from "@/hooks/useCustomers/queryKey";
import type { ListCustomersResponse } from "@/hooks/useCustomers/server";

export type CustomersDirectoryClientProps = {
	initialFilters: CustomersQueryFilters;
	initialList: ListCustomersResponse;
};

export function CustomersDirectoryClient({
	initialFilters,
	initialList,
}: CustomersDirectoryClientProps) {
	const [inputValue, setInputValue] = React.useState(initialFilters.q);
	const [appliedSearch, setAppliedSearch] = React.useState(initialFilters.q);
	const [page, setPage] = React.useState(initialFilters.page);
	const skipFirstDebounce = React.useRef(true);

	React.useEffect(() => {
		if (skipFirstDebounce.current) {
			skipFirstDebounce.current = false;
			return;
		}
		const handle = window.setTimeout(() => {
			setAppliedSearch(inputValue);
			setPage(1);
		}, 350);
		return () => window.clearTimeout(handle);
	}, [inputValue]);

	const filters = React.useMemo(
		(): CustomersQueryFilters => ({
			q: appliedSearch,
			page,
			limit: initialFilters.limit,
		}),
		[appliedSearch, page, initialFilters.limit],
	);

	const isInitialKey =
		filters.q === initialFilters.q &&
		filters.page === initialFilters.page &&
		filters.limit === initialFilters.limit;

	const { data, isFetching } = useCustomersQuery(filters, {
		...(isInitialKey ? { initialData: initialList } : {}),
	});

	const list = data ?? initialList;
	const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize));

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Player directory"
				description="Browse player profiles (non-admin accounts). Read-only; enforcement lives in Moderation."
			>
				<div className="space-y-4">
					<CustomerDirectorySearchBar
						value={inputValue}
						onChange={setInputValue}
					/>
					{isFetching ? (
						<p className="text-small text-text-secondary">Updating results…</p>
					) : null}
					<CustomersTable rows={list.rows} />
					<div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
						<p className="text-small text-text-secondary">
							Page {list.page} of {totalPages} · {list.total} players
						</p>
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={list.page <= 1 || isFetching}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
							>
								Previous
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={!list.hasMore || isFetching}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</PageSection>
		</div>
	);
}

CustomersDirectoryClient.displayName = "CustomersDirectoryClient";
