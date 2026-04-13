"use client";

import * as React from "react";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { AdminUsersTable } from "@/components/modules/users/AdminUsersTable/AdminUsersTable";
import {
	type AdminUserRow,
	MOCK_ADMIN_USERS,
} from "@/constants/mock-admin-users";
import { AddUserDialog } from "../AddUserDialog/AddUserDialog";

export function UsersView() {
	const [users, setUsers] = React.useState<AdminUserRow[]>(MOCK_ADMIN_USERS);

	const active = users.filter((u) => u.status === "active").length;
	const inactive = users.filter((u) => u.status === "inactive").length;

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Platform admins"
				description="Mock directory of internal accounts. Use status and search filters on the table — no API calls."
			>
				<div className="flex flex-wrap gap-4">
					<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
						<p className="text-label uppercase text-text-secondary">Total</p>
						<p className="mt-1 text-heading text-text-primary">
							{users.length}
						</p>
					</div>
					<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
						<p className="text-label uppercase text-text-secondary">Active</p>
						<p className="mt-1 text-heading text-accent">{active}</p>
					</div>
					<div className="rounded-lg border border-border bg-bg-surface px-4 py-3">
						<p className="text-label uppercase text-text-secondary">Inactive</p>
						<p className="mt-1 text-heading text-text-secondary">{inactive}</p>
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
					<AddUserDialog
						onUserAdded={(u) => setUsers((prev) => [...prev, u])}
					/>
				</div>
				<AdminUsersTable data={users} />
			</section>
		</div>
	);
}
