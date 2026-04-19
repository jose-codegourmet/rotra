import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { WaitlistView } from "@/components/modules/waitlist/WaitlistView";
import {
	loadWaitlistPage,
	loadWaitlistStats,
	WAITLIST_INITIAL_PAGE_INDEX,
	WAITLIST_INITIAL_PAGE_SIZE,
	waitlistQueryKeys,
} from "@/lib/waitlist-admin";

const PREFETCH_STALE_MS = 60_000;

export default async function WaitlistPage() {
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: waitlistQueryKeys.page(
				WAITLIST_INITIAL_PAGE_INDEX,
				WAITLIST_INITIAL_PAGE_SIZE,
			),
			queryFn: () =>
				loadWaitlistPage(
					WAITLIST_INITIAL_PAGE_INDEX,
					WAITLIST_INITIAL_PAGE_SIZE,
				),
			staleTime: PREFETCH_STALE_MS,
		}),
		queryClient.prefetchQuery({
			queryKey: waitlistQueryKeys.stats(),
			queryFn: loadWaitlistStats,
			staleTime: PREFETCH_STALE_MS,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<WaitlistView />
		</HydrationBoundary>
	);
}
