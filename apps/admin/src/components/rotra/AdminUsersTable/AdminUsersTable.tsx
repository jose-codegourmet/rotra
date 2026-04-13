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
import type { AdminUserRow } from "@/constants/mock-admin-users";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<AdminUserRow>();

function buildColumns() {
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
		columnHelper.accessor("role", {
			header: "Role",
			cell: (info) => (
				<span className="text-text-secondary">{info.getValue()}</span>
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
						{s}
					</span>
				);
			},
		}),
		columnHelper.accessor("lastActive", {
			header: "Last active",
			cell: (info) => (
				<span className="text-text-secondary">{info.getValue()}</span>
			),
		}),
	];
}

export function AdminUsersTable({ data }: { data: AdminUserRow[] }) {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);

	const columns = React.useMemo(() => buildColumns(), []);

	const table = useReactTable({
		data,
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
			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
				<label className="flex min-h-12 flex-1 flex-col gap-1 sm:max-w-xs">
					<span className="text-label uppercase text-text-secondary">
						Search
					</span>
					<input
						type="search"
						value={search}
						onChange={(e) => nameCol?.setFilterValue(e.target.value)}
						placeholder="Name or email"
						className="h-12 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent"
					/>
				</label>
				<label className="flex min-h-12 flex-col gap-1 sm:w-48">
					<span className="text-label uppercase text-text-secondary">
						Status
					</span>
					<select
						value={statusFilter === "" ? "all" : statusFilter}
						onChange={(e) => {
							const v = e.target.value;
							statusCol?.setFilterValue(v === "all" ? undefined : v);
						}}
						className="h-12 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
					>
						<option value="all">All users</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</label>
				<p className="text-small text-text-secondary sm:ml-auto sm:self-end">
					{table.getFilteredRowModel().rows.length} shown
				</p>
			</div>

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
