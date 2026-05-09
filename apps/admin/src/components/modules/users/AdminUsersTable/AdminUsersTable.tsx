"use client";

import {
	type ColumnFiltersState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { AddUserDialog } from "@/components/modules/users/AddUserDialog/AddUserDialog";
import { AdminUsersTableFilters } from "@/components/modules/users/AdminUsersTable/AdminUsersTableFilters";
import { AdminUserTableCellActions } from "@/components/modules/users/AdminUsersTable/AdminUserTableCellActions";
import {
	useAdminUsersQuery,
	useInviteAdminUserMutation,
} from "@/hooks/useAdminUsers/client";
import { cn } from "@/lib/utils";
import type { AdminUserRow } from "../users.types";

const columnHelper = createColumnHelper<AdminUserRow>();

type AdminUsersTableProps = {
	data: AdminUserRow[];
	canManageUsers: boolean;
};

function roleLabel(role: AdminUserRow["adminRole"]): string {
	return role === "super_admin" ? "Super admin" : "Admin";
}

function statusLabel(status: AdminUserRow["status"]): string {
	return status === "invited"
		? "Invited"
		: status === "active"
			? "Active"
			: "Inactive";
}

function lastActiveLabel(lastActiveAt: string | null): string {
	if (!lastActiveAt) return "Never";
	return new Date(lastActiveAt).toLocaleString();
}

function buildColumns(input: {
	canManageUsers: boolean;
	onActionError: (message: string | null) => void;
}) {
	return [
		columnHelper.accessor("name", {
			header: "Name",
			filterFn: (row, _columnId, filterValue: string) => {
				if (!filterValue?.trim()) return true;
				const q = filterValue.toLowerCase();
				const name = String(row.getValue("name")).toLowerCase();
				const email = String(row.getValue("email")).toLowerCase();
				return name.includes(q) || email.includes(q);
			},
			cell: (info) => (
				<span className="font-medium text-text-primary">{info.getValue()}</span>
			),
		}),
		columnHelper.accessor("email", {
			header: "Email",
			cell: (info) => (
				<span className="text-text-secondary">{info.getValue()}</span>
			),
		}),
		columnHelper.accessor("adminRole", {
			header: "Role",
			cell: (info) => (
				<span className="text-text-secondary">
					{roleLabel(info.row.original.adminRole)}
				</span>
			),
		}),
		columnHelper.accessor("status", {
			header: "Status",
			filterFn: (row, columnId, filterValue: string | undefined) => {
				if (filterValue == null || filterValue === "") return true;
				return row.getValue(columnId) === filterValue;
			},
			cell: (info) => {
				const s = info.getValue();
				return (
					<span
						className={cn(
							"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
							s === "active"
								? "border border-accent/40 bg-accent-subtle text-accent"
								: "border border-border bg-bg-elevated text-text-secondary",
						)}
					>
						{statusLabel(s)}
					</span>
				);
			},
		}),
		columnHelper.accessor("lastActiveAt", {
			header: "Last active",
			cell: (info) => (
				<span className="text-text-secondary">
					{lastActiveLabel(info.getValue())}
				</span>
			),
		}),
		columnHelper.display({
			id: "actions",
			header: () => (
				<span className="sr-only text-micro font-bold uppercase tracking-widest text-text-secondary">
					Actions
				</span>
			),
			cell: ({ row }) => {
				const user = row.original;
				return (
					<AdminUserTableCellActions
						user={user}
						canManageUsers={input.canManageUsers}
						onActionError={input.onActionError}
					/>
				);
			},
		}),
	];
}

export function AdminUsersTable({
	data,
	canManageUsers,
}: AdminUsersTableProps) {
	const [error, setError] = React.useState<string | null>(null);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	const {
		data: adminUsersData,
		error: queryError,
		isFetching,
	} = useAdminUsersQuery();

	const inviteMutation = useInviteAdminUserMutation();

	const users = adminUsersData?.users ?? data;

	const inviteAdmin = React.useCallback(
		async (payload: {
			name: string;
			email: string;
			role: "admin" | "super_admin";
		}) => {
			try {
				setError(null);
				await inviteMutation.mutateAsync(payload);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to invite admin.",
				);
			}
		},
		[inviteMutation],
	);

	const columns = React.useMemo(
		() =>
			buildColumns({
				canManageUsers,
				onActionError: setError,
			}),
		[canManageUsers],
	);

	const table = useReactTable({
		data: users,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const nameCol = table.getColumn("name");
	const statusCol = table.getColumn("status");
	const search = (nameCol?.getFilterValue() as string | undefined) ?? "";
	const statusFilter =
		(statusCol?.getFilterValue() as string | undefined) ?? "";

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				{error || queryError ? (
					<p className="text-small text-danger">
						{error ??
							(queryError instanceof Error
								? queryError.message
								: "Failed to load admin users.")}
					</p>
				) : (
					<span />
				)}
				{canManageUsers ? <AddUserDialog onInvite={inviteAdmin} /> : null}
			</div>
			{isFetching ? (
				<p className="text-small text-text-secondary">
					Refreshing admin users...
				</p>
			) : null}
			<AdminUsersTableFilters
				search={search}
				statusFilter={statusFilter}
				shownCount={table.getFilteredRowModel().rows.length}
				onSearchChange={(nextValue) => nameCol?.setFilterValue(nextValue)}
				onStatusChange={(nextValue) =>
					statusCol?.setFilterValue(nextValue === "all" ? undefined : nextValue)
				}
			/>

			<div className="overflow-x-auto rounded-lg border border-border bg-bg-surface">
				<table className="w-full min-w-[640px] text-left text-small">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id} className="border-b border-border bg-bg-base">
								{hg.headers.map((h) => (
									<th
										key={h.id}
										className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary"
									>
										{h.isPlaceholder
											? null
											: flexRender(h.column.columnDef.header, h.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-8 text-center text-body text-text-secondary"
								>
									No users match the current filters.
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-border last:border-0 hover:bg-bg-elevated/60"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3 align-middle">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

AdminUsersTable.displayName = "AdminUsersTable";
