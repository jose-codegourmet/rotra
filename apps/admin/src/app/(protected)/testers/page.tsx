import { db, listTesterProfiles, type TesterDirectoryStatus } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { TestersView } from "@/components/modules/testers/TestersView";
import { testersListQueryKey } from "@/hooks/useTesters/queryKey";
import { serializeTestersListResult } from "@/hooks/useTesters/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

const DEFAULT_FILTERS = { page: 1, limit: 20 } as const;

export default async function TestersPage({
	searchParams,
}: {
	searchParams: Promise<{ status?: string }>;
}) {
	await requireAdminSession();
	const params = await searchParams;
	const status: TesterDirectoryStatus | undefined =
		params.status === "pending" ||
		params.status === "active" ||
		params.status === "revoked" ||
		params.status === "expired"
			? params.status
			: undefined;

	const result = await listTesterProfiles(db, {
		page: DEFAULT_FILTERS.page,
		limit: DEFAULT_FILTERS.limit,
		...(status !== undefined ? { status } : {}),
	});

	const initialList = serializeTestersListResult(result);
	const listFilters = {
		page: DEFAULT_FILTERS.page,
		limit: DEFAULT_FILTERS.limit,
		...(status !== undefined ? { status } : {}),
	};

	const queryClient = new QueryClient();
	queryClient.setQueryData(testersListQueryKey(listFilters), initialList);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TestersView initialFilters={listFilters} initialList={initialList} />
		</HydrationBoundary>
	);
}
