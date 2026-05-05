import { db, listAdminUsers } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { AdminUsersTable } from "@/components/modules/users/AdminUsersTable/AdminUsersTable";
import type { AdminUserRow } from "@/components/modules/users/users.types";
import { adminUsersQueryKey } from "@/hooks/useAdminUsers/queryKey";
import { requireAdminSession } from "@/lib/auth/admin-session";

function toIsoOrNull(value: Date | null): string | null {
	return value ? value.toISOString() : null;
}

export default async function AdminsPage() {
	const [session, users] = await Promise.all([
		requireAdminSession(),
		listAdminUsers(db),
	]);

	const serializedUsers = users.map((user) => ({
		...user,
		adminInvitedAt: toIsoOrNull(user.adminInvitedAt),
		adminActivatedAt: toIsoOrNull(user.adminActivatedAt),
		adminDeactivatedAt: toIsoOrNull(user.adminDeactivatedAt),
		lastActiveAt: toIsoOrNull(user.lastActiveAt),
	})) satisfies AdminUserRow[];

	const active = serializedUsers.filter((u) => u.status === "active").length;
	const inactive = serializedUsers.filter(
		(u) => u.status === "inactive",
	).length;
	const invited = serializedUsers.filter((u) => u.status === "invited").length;
	const canManageUsers = session.adminRole === "super_admin";
	const queryClient = new QueryClient();
	queryClient.setQueryData(adminUsersQueryKey(), {
		users: serializedUsers,
		actor: {
			profileId: session.profileId,
			adminRole: session.adminRole,
		},
	});
	const dehydratedState = dehydrate(queryClient);

	return (
		<HydrationBoundary state={dehydratedState}>
			<div className="mx-auto max-w-6xl space-y-8">
				<PageSection
					title="Platform admins"
					description="Directory of internal admin accounts with role and status controls."
				>
					<div className="flex flex-wrap gap-4 w-full">
						<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
							<p className="text-label uppercase text-text-secondary">Total</p>
							<p className="mt-1 text-heading text-text-primary">
								{serializedUsers.length}
							</p>
						</div>
						<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
							<p className="text-label uppercase text-text-secondary">Active</p>
							<p className="mt-1 text-heading text-accent">{active}</p>
						</div>
						<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
							<p className="text-label uppercase text-text-secondary">
								Invited
							</p>
							<p className="mt-1 text-heading text-text-secondary">{invited}</p>
						</div>
						<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
							<p className="text-label uppercase text-text-secondary">
								Inactive
							</p>
							<p className="mt-1 text-heading text-text-secondary">
								{inactive}
							</p>
						</div>
					</div>
				</PageSection>

				<section className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
						<div>
							<h2 className="text-heading text-text-primary">Directory</h2>
							<p className="mt-1 text-body text-text-secondary">
								Search and filter platform admin accounts.
							</p>
						</div>
					</div>
					<AdminUsersTable
						data={serializedUsers}
						canManageUsers={canManageUsers}
					/>
				</section>
			</div>
		</HydrationBoundary>
	);
}
