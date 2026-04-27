"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type RowSelectionState,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

import { ApplicationStatusPill } from "./ApplicationStatusPill";
import { formatSlaRemaining } from "./club-application-sla";

export type ApplicationQueueTableProps = {
	rows: ClubApplicationListRowDto[];
	isLoading: boolean;
	error: Error | null;
	selectedId: string | null;
	sort: string;
	onSortChange: (sort: string) => void;
	status: string | undefined;
	onStatusChange: (status: string | undefined) => void;
	selectedIds: Set<string>;
	onToggleSelect: (id: string, selected: boolean) => void;
	onToggleSelectAllOnPage: (ids: string[], selected: boolean) => void;
	onSelectRow: (row: ClubApplicationListRowDto) => void;
	onRefresh: () => void;
};

const columnHelper = createColumnHelper<ClubApplicationListRowDto>();

function buildColumns(
	sort: string,
	onSortChange: (sort: string) => void,
	selectedIds: Set<string>,
	onToggleSelectAllOnPage: (ids: string[], selected: boolean) => void,
) {
	return [
		columnHelper.display({
			id: "select",
			header: ({ table }) => {
				const actionableIds = table
					.getRowModel()
					.rows.filter((r) => r.getCanSelect())
					.map((r) => r.original.id);
				const allSelected =
					actionableIds.length > 0 &&
					actionableIds.every((id) => selectedIds.has(id));
				return (
					<Checkbox
						checked={allSelected}
						onCheckedChange={(checked: boolean) =>
							onToggleSelectAllOnPage(actionableIds, checked)
						}
						aria-label="Select all actionable on page"
					/>
				);
			},
			cell: ({ row }) => (
				<Checkbox
					disabled={!row.getCanSelect()}
					checked={row.getIsSelected()}
					onCheckedChange={(checked: boolean) => row.toggleSelected(checked)}
					onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
					aria-label={`Select ${row.original.clubName}`}
				/>
			),
		}),
		columnHelper.display({
			id: "applicant",
			header: "Applicant",
			cell: ({ row }) => (
				<>
					<div className="font-medium text-text-primary">
						{row.original.applicantName}
					</div>
					<div className="text-text-secondary text-micro">
						{row.original.applicantEmail}
					</div>
				</>
			),
		}),
		columnHelper.accessor("clubName", {
			header: "Club",
			cell: (info) => (
				<span className="text-text-primary">{info.getValue()}</span>
			),
		}),
		columnHelper.accessor("locationCity", {
			header: "City",
			cell: (info) => (
				<span className="text-text-secondary">{info.getValue()}</span>
			),
		}),
		columnHelper.accessor("status", {
			header: "Status",
			cell: (info) => <ApplicationStatusPill status={info.getValue()} />,
		}),
		columnHelper.display({
			id: "sla",
			header: "SLA",
			cell: ({ row }) => (
				<span className="text-text-secondary whitespace-nowrap">
					{formatSlaRemaining(row.original)}
				</span>
			),
		}),
		columnHelper.accessor("updatedAt", {
			header: () => (
				<button
					type="button"
					className="underline-offset-2 hover:underline text-left"
					onClick={() =>
						onSortChange(
							sort === "newest"
								? "oldest"
								: sort === "oldest"
									? "sla"
									: "newest",
						)
					}
				>
					Updated
				</button>
			),
			cell: (info) => (
				<span className="text-text-secondary whitespace-nowrap">
					{new Date(info.getValue()).toLocaleString()}
				</span>
			),
		}),
	];
}

function rowSelectionFromSet(selectedIds: Set<string>): RowSelectionState {
	const r: RowSelectionState = {};
	for (const id of selectedIds) r[id] = true;
	return r;
}

export function ApplicationQueueTable({
	rows,
	isLoading,
	error,
	selectedId,
	sort,
	onSortChange,
	status,
	onStatusChange,
	selectedIds,
	onToggleSelect,
	onToggleSelectAllOnPage,
	onSelectRow,
	onRefresh,
}: ApplicationQueueTableProps) {
	const rowSelection = React.useMemo(
		() => rowSelectionFromSet(selectedIds),
		[selectedIds],
	);

	const onRowSelectionChange = React.useCallback<OnChangeFn<RowSelectionState>>(
		(updater) => {
			const prev = rowSelectionFromSet(selectedIds);
			const next = typeof updater === "function" ? updater(prev) : updater;
			const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
			for (const id of keys) {
				const was = !!prev[id];
				const now = !!next[id];
				if (was !== now) onToggleSelect(id, now);
			}
		},
		[selectedIds, onToggleSelect],
	);

	const columns = React.useMemo(
		() =>
			buildColumns(sort, onSortChange, selectedIds, onToggleSelectAllOnPage),
		[sort, onSortChange, selectedIds, onToggleSelectAllOnPage],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getRowId: (row) => row.id,
		state: { rowSelection },
		onRowSelectionChange,
		enableRowSelection: (row) =>
			row.original.status === "pending" || row.original.status === "in_review",
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-3 text-small">
				<label className="flex items-center gap-2">
					<span className="text-text-secondary">Status</span>
					<select
						className="rounded-md border border-border bg-bg-surface px-2 py-1.5"
						value={status ?? ""}
						onChange={(e) =>
							onStatusChange(e.target.value === "" ? undefined : e.target.value)
						}
					>
						<option value="">All</option>
						<option value="pending">Pending</option>
						<option value="in_review">In review</option>
						<option value="approved">Approved</option>
						<option value="rejected">Rejected</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</label>
				<label className="flex items-center gap-2">
					<span className="text-text-secondary">Sort</span>
					<select
						className="rounded-md border border-border bg-bg-surface px-2 py-1.5"
						value={sort}
						onChange={(e) => onSortChange(e.target.value)}
					>
						<option value="newest">Newest first</option>
						<option value="oldest">Oldest first</option>
						<option value="sla">Longest waiting (SLA)</option>
					</select>
				</label>
				<Button type="button" variant="outline" size="sm" onClick={onRefresh}>
					Refresh
				</Button>
			</div>

			{isLoading ? (
				<p className="text-text-secondary text-small">Loading…</p>
			) : null}
			{error ? (
				<p className="text-error text-small">{String(error.message)}</p>
			) : null}

			{!isLoading && rows.length === 0 ? (
				<p className="text-text-secondary text-small">
					No applications in this view.
				</p>
			) : null}

			{rows.length > 0 ? (
				<div className="overflow-x-auto rounded-lg border border-border">
					<table className="min-w-[760px] w-full text-left text-small">
						<thead className="border-b border-border bg-bg-elevated text-micro font-bold uppercase tracking-widest text-text-secondary">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className={`px-2 py-2 ${header.column.id === "select" ? "w-10" : ""}`}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									tabIndex={0}
									className={`border-b border-border last:border-0 cursor-pointer hover:bg-bg-elevated/60 ${
										selectedId === row.original.id ? "bg-bg-elevated" : ""
									}`}
									onClick={() => onSelectRow(row.original)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											onSelectRow(row.original);
										}
									}}
								>
									{row.getVisibleCells().map((cell) => {
										const isSelect = cell.column.id === "select";
										return (
											<td
												key={cell.id}
												className="px-2 py-2"
												{...(isSelect
													? {
															onClick: (
																e: React.MouseEvent<HTMLTableCellElement>,
															) => e.stopPropagation(),
															onKeyDown: (
																e: React.KeyboardEvent<HTMLTableCellElement>,
															) => {
																if (e.key === "Enter" || e.key === " ") {
																	e.stopPropagation();
																}
															},
														}
													: {})}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : null}
		</div>
	);
}
