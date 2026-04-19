"use client";

import { useQuery } from "@tanstack/react-query";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type PaginationState,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";
import {
	WAITLIST_INITIAL_PAGE_INDEX,
	WAITLIST_INITIAL_PAGE_SIZE,
	type WaitlistApiResponse,
	waitlistQueryKeys,
} from "@/lib/waitlist-admin";

type WaitlistRow = WaitlistApiResponse["rows"][number];

const columnHelper = createColumnHelper<WaitlistRow>();

const dateFmt = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

function buildColumns() {
	return [
		columnHelper.accessor("email", {
			header: "Email",
			cell: (info) => (
				<span className="font-medium text-text-primary">{info.getValue()}</span>
			),
		}),
		columnHelper.accessor("createdAt", {
			header: "Signed up",
			cell: (info) => {
				const v = info.getValue();
				const d = new Date(v);
				return (
					<span className="text-text-secondary">
						{Number.isNaN(d.getTime()) ? v : dateFmt.format(d)}
					</span>
				);
			},
		}),
	];
}

async function fetchWaitlistPage(
	pageIndex: number,
	pageSize: number,
): Promise<WaitlistApiResponse> {
	const page = pageIndex + 1;
	const params = new URLSearchParams({
		page: String(page),
		pageSize: String(pageSize),
	});
	const res = await fetch(`/api/waitlist?${params.toString()}`);
	if (!res.ok) {
		const err = (await res.json().catch(() => null)) as {
			error?: string;
		} | null;
		throw new Error(err?.error ?? "Failed to load waitlist.");
	}
	return res.json() as Promise<WaitlistApiResponse>;
}

export function AdminWaitlistTable() {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: WAITLIST_INITIAL_PAGE_INDEX,
		pageSize: WAITLIST_INITIAL_PAGE_SIZE,
	});

	const query = useQuery({
		queryKey: waitlistQueryKeys.page(pagination.pageIndex, pagination.pageSize),
		queryFn: () => fetchWaitlistPage(pagination.pageIndex, pagination.pageSize),
	});

	const rows = query.data?.rows ?? [];
	const total = query.data?.total ?? 0;
	const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

	const columns = React.useMemo(() => buildColumns(), []);

	const table = useReactTable({
		data: rows,
		columns,
		pageCount,
		state: { pagination },
		onPaginationChange: setPagination,
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="space-y-4">
			{query.isError ? (
				<p className="text-body text-error" role="alert">
					{query.error instanceof Error
						? query.error.message
						: "Something went wrong."}
				</p>
			) : null}

			<div className="overflow-x-auto rounded-lg border border-border bg-bg-surface">
				<table className="w-full min-w-[480px] text-left text-small">
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
						{query.isLoading ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-8 text-center text-body text-text-secondary"
								>
									Loading…
								</td>
							</tr>
						) : table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-8 text-center text-body text-text-secondary"
								>
									No signups yet.
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

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
				<p className="text-small text-text-secondary">
					{query.isSuccess ? (
						<>
							Showing{" "}
							<span className="text-text-primary">
								{total === 0
									? 0
									: pagination.pageIndex * pagination.pageSize + 1}
								–
								{Math.min(
									(pagination.pageIndex + 1) * pagination.pageSize,
									total,
								)}
							</span>{" "}
							of <span className="text-text-primary">{total}</span>
						</>
					) : (
						"—"
					)}
				</p>

				<div className="flex flex-wrap items-center gap-2">
					<label className="flex items-center gap-2 text-small text-text-secondary">
						<span className="text-label uppercase">Rows</span>
						<select
							className={cn(
								"h-10 rounded-md border border-border bg-bg-elevated px-2 text-body text-text-primary",
								"focus:outline-none focus:ring-1 focus:ring-accent",
							)}
							value={pagination.pageSize}
							onChange={(e) => {
								const next = Number.parseInt(e.target.value, 10);
								setPagination({ pageIndex: 0, pageSize: next });
							}}
						>
							{[10, 20, 50].map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={pagination.pageIndex <= 0 || query.isFetching}
						onClick={() =>
							setPagination((p) => ({
								...p,
								pageIndex: Math.max(0, p.pageIndex - 1),
							}))
						}
					>
						Previous
					</Button>
					<span className="text-small text-text-secondary">
						Page {pagination.pageIndex + 1} of {pageCount}
					</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={
							pagination.pageIndex >= pageCount - 1 ||
							query.isFetching ||
							total === 0
						}
						onClick={() =>
							setPagination((p) => ({
								...p,
								pageIndex: Math.min(pageCount - 1, p.pageIndex + 1),
							}))
						}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}

AdminWaitlistTable.displayName = "AdminWaitlistTable";
