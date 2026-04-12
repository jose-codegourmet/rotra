"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Pill } from "@/components/ui/pill/Pill";
import type { ManageMemberRow } from "@/constants/mock-club";

const columnHelper = createColumnHelper<ManageMemberRow>();

const columns = [
	columnHelper.display({
		id: "operator",
		header: "Operator",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="text-body font-semibold text-text-primary">
					{row.original.name}
				</span>
				<span className="text-micro text-text-secondary">
					{row.original.email}
				</span>
			</div>
		),
	}),
	columnHelper.accessor("joinedAt", {
		header: "Joined",
		cell: (info) => (
			<span className="text-small text-text-secondary">{info.getValue()}</span>
		),
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (info) => {
			const v = info.getValue();
			return <Pill variant={v === "active" ? "accent" : "muted"}>{v}</Pill>;
		},
	}),
	columnHelper.accessor("matchesManaged", {
		header: "Matches",
		cell: (info) => (
			<span className="text-title font-semibold text-text-primary tabular-nums">
				{info.getValue().toLocaleString()}
			</span>
		),
	}),
	columnHelper.display({
		id: "actions",
		header: "",
		cell: () => (
			<span className="text-micro text-text-disabled uppercase tracking-widest">
				Actions
			</span>
		),
	}),
];

export function ClubManageMembersTable({ data }: { data: ManageMemberRow[] }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded-lg border border-border bg-bg-base overflow-x-auto">
			<table className="w-full min-w-[640px] text-left text-small">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id} className="border-b border-border bg-bg-surface">
							{hg.headers.map((h) => (
								<th
									key={h.id}
									className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-accent"
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
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className="border-b border-border last:border-0 hover:bg-bg-surface/80"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-4 py-3 align-middle">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
