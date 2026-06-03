import {
	db,
	getTesterProfileDetail,
	TesterInvitationError,
	type TesterProfileDetail,
} from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { TesterDetailPanel } from "@/components/modules/testers/TesterDetailPanel";
import { testerDetailQueryKey } from "@/hooks/useTesters/queryKey";
import { serializeTesterDetail } from "@/hooks/useTesters/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

const DEFAULT_LIST_FILTERS = { page: 1, limit: 20 } as const;

export default async function TesterDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireAdminSession();
	const { id } = await params;

	let detail: TesterProfileDetail;
	try {
		detail = await getTesterProfileDetail(db, id);
	} catch (error) {
		if (error instanceof TesterInvitationError && error.code === "not_found") {
			notFound();
		}
		throw error;
	}

	const serialized = serializeTesterDetail(detail);
	const queryClient = new QueryClient();
	queryClient.setQueryData(testerDetailQueryKey(id), { profile: serialized });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TesterDetailPanel
				profileId={id}
				listFilters={DEFAULT_LIST_FILTERS}
				initialDetail={{ profile: serialized }}
			/>
		</HydrationBoundary>
	);
}
