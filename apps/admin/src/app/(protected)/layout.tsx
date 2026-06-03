import { db, listAdminNotificationsForInbox } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import { adminNotificationsQueryKey } from "@/hooks/useAdminNotifications/queryKey";
import { serializeAdminNotificationsListResult } from "@/hooks/useAdminNotifications/server";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

const SHELL_NOTIFICATION_FILTERS = { page: 1, limit: 5 } as const;

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let session: Awaited<ReturnType<typeof requireAdminSession>>;
	try {
		session = await requireAdminSession();
	} catch (error) {
		if (error instanceof AdminSessionError) {
			if (error.status === 401) {
				redirect("/login");
			}
			const message = error.message.toLowerCase();
			if (message.includes("profile")) {
				redirect("/login?error=admin_profile_missing");
			}
			if (message.includes("role")) {
				redirect("/login?error=admin_role_missing");
			}
			if (message.includes("inactive")) {
				redirect("/login?error=admin_inactive");
			}
			redirect("/login?error=forbidden");
		}
		redirect("/login?error=auth_unavailable");
	}

	const inboxResult = await listAdminNotificationsForInbox(db, {
		adminId: session.profileId,
		...SHELL_NOTIFICATION_FILTERS,
	});

	const queryClient = new QueryClient();
	queryClient.setQueryData(
		adminNotificationsQueryKey(SHELL_NOTIFICATION_FILTERS),
		serializeAdminNotificationsListResult(inboxResult),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminShell adminRole={session.adminRole}>{children}</AdminShell>
		</HydrationBoundary>
	);
}
