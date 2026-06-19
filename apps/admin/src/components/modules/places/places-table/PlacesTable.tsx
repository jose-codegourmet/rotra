"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Check, Pencil, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button/Button";
import type { PlaceRow } from "@/hooks/usePlaces/server";
import { cn } from "@/lib/utils/tailwind";

import {
	type PlaceStatusBadgeVariants,
	placeStatusBadgeVariants,
} from "./PlacesTable.variants";

const columnHelper = createColumnHelper<PlaceRow>();

const createdAtFmt = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

function truncate(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;
	return `${value.slice(0, maxLength)}…`;
}

function formatCreatedAt(iso: string): string {
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? iso : createdAtFmt.format(date);
}

function statusLabel(status: PlaceStatusBadgeVariants["status"]): string {
	return status === "confirmed" ? "Confirmed" : "Unreviewed";
}

function submittedByLabel(place: PlaceRow): string {
	return place.submittedBy?.displayName ?? "Admin";
}

function buildColumns(input: {
	onEdit?: (place: PlaceRow) => void;
	onConfirm?: (place: PlaceRow) => void;
	onDelete?: (place: PlaceRow) => void;
}) {
	const actionsDisabled = !input.onEdit && !input.onConfirm && !input.onDelete;

	return [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => (
				<span className="font-medium text-text-primary">
					{truncate(info.getValue(), 60)}
				</span>
			),
		}),
		columnHelper.accessor("address", {
			header: "Address",
			cell: (info) => (
				<span className="max-w-[280px] truncate text-text-secondary">
					{truncate(info.getValue(), 80)}
				</span>
			),
		}),
		columnHelper.accessor("status", {
			header: "Status",
			cell: (info) => {
				const status = info.getValue();
				return (
					<span className={cn(placeStatusBadgeVariants({ status }))}>
						{statusLabel(status)}
					</span>
				);
			},
		}),
		columnHelper.display({
			id: "submittedBy",
			header: "Submitted by",
			cell: ({ row }) => (
				<span className="text-text-secondary">
					{submittedByLabel(row.original)}
				</span>
			),
		}),
		columnHelper.accessor("createdAt", {
			header: "Created at",
			cell: (info) => (
				<span className="text-text-secondary">
					{formatCreatedAt(info.getValue())}
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
				const place = row.original;
				return (
					<div className="flex items-center justify-end gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							disabled={actionsDisabled}
							aria-label={`Edit ${place.name}`}
							onClick={() => input.onEdit?.(place)}
						>
							<Pencil className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							disabled={actionsDisabled || place.status === "confirmed"}
							aria-label={`Confirm ${place.name}`}
							onClick={() => input.onConfirm?.(place)}
						>
							<Check className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							disabled={actionsDisabled}
							aria-label={`Delete ${place.name}`}
							onClick={() => input.onDelete?.(place)}
						>
							<Trash2 className="size-4" />
						</Button>
					</div>
				);
			},
		}),
	];
}

interface PlacesTableProps {
	data: PlaceRow[];
	onEdit?: (place: PlaceRow) => void;
	onConfirm?: (place: PlaceRow) => void;
	onDelete?: (place: PlaceRow) => void;
}

export function PlacesTable({
	data,
	onEdit,
	onConfirm,
	onDelete,
}: PlacesTableProps) {
	const columns = React.useMemo(() => {
		const handlers: {
			onEdit?: (place: PlaceRow) => void;
			onConfirm?: (place: PlaceRow) => void;
			onDelete?: (place: PlaceRow) => void;
		} = {};
		if (onEdit) handlers.onEdit = onEdit;
		if (onConfirm) handlers.onConfirm = onConfirm;
		if (onDelete) handlers.onDelete = onDelete;
		return buildColumns(handlers);
	}, [onEdit, onConfirm, onDelete]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-x-auto rounded-lg border border-border bg-bg-surface">
			<table className="w-full min-w-[900px] text-left text-small">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr
							key={headerGroup.id}
							className="border-b border-border bg-bg-base"
						>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary"
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
					{table.getRowModel().rows.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="px-4 py-8 text-center text-body text-text-secondary"
							>
								No places match the current filter.
							</td>
						</tr>
					) : (
						table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border bg-bg-surface last:border-0 hover:bg-bg-elevated/60"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-3 align-middle">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

PlacesTable.displayName = "PlacesTable";
