import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { TagsView } from "@/components/modules/tags/TagsView";
import { tagDefinitionsQueryKey } from "@/hooks/useTagDefinitions/queryKey";
import { fetchTagDefinitionsForPage } from "@/hooks/useTagDefinitions/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function TagsPage() {
	const session = await requireAdminSession();
	const isSuperAdmin = session.adminRole === "super_admin";
	const initialData = await fetchTagDefinitionsForPage(isSuperAdmin);

	const queryClient = new QueryClient();
	queryClient.setQueryData(tagDefinitionsQueryKey(), initialData);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TagsView canMutate={isSuperAdmin} />
		</HydrationBoundary>
	);
}
