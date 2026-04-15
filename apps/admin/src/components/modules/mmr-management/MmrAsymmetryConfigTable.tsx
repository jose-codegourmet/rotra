"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import {
	MMR_ASYMMETRY_CONFIG_DEFAULT_ROWS,
	type MmrAsymmetryConfigRow,
} from "@/constants/mmr-asymmetry-config";

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent";

const columnHelper = createColumnHelper<MmrAsymmetryConfigRow>();

export function MmrAsymmetryConfigTable() {
	const [data, setData] = React.useState<MmrAsymmetryConfigRow[]>(() => [
		...MMR_ASYMMETRY_CONFIG_DEFAULT_ROWS,
	]);
	const [editingRow, setEditingRow] =
		React.useState<MmrAsymmetryConfigRow | null>(null);
	const [value, setValue] = React.useState("");
	const [description, setDescription] = React.useState("");

	React.useEffect(() => {
		if (editingRow) {
			setValue(editingRow.value);
			setDescription(editingRow.description);
		}
	}, [editingRow]);

	const columns = React.useMemo(
		() => [
			columnHelper.accessor("key", {
				header: "Key",
				cell: (info) => (
					<span className="font-mono text-small text-text-primary">
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("value", {
				header: "Value",
				cell: (info) => (
					<span className="text-text-secondary">{info.getValue()}</span>
				),
			}),
			columnHelper.accessor("description", {
				header: "Description",
				cell: (info) => (
					<span className="text-small text-text-secondary">
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setEditingRow(row.original)}
					>
						Edit
					</Button>
				),
			}),
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!editingRow) return;
		setData((rows) =>
			rows.map((r) =>
				r.id === editingRow.id
					? { ...r, value: value.trim(), description: description.trim() }
					: r,
			),
		);
		setEditingRow(null);
	}

	return (
		<>
			<PageTable minWidthClassName="min-w-[680px]">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id} className="border-b border-border bg-bg-base">
							{hg.headers.map((h) => (
								<th
									key={h.id}
									className="px-4 py-3 text-left text-micro font-bold uppercase tracking-widest text-text-secondary"
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
							className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-4 py-3 align-middle">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</PageTable>

			<Dialog
				open={editingRow !== null}
				onOpenChange={(next) => {
					if (!next) setEditingRow(null);
				}}
			>
				<DialogContent>
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>Edit MMR asymmetry setting</DialogTitle>
							<DialogDescription>
								Updates a mock row in this directory only — no API yet. Product
								config applies to future matches only.
							</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col gap-4 py-2">
							<div className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Key
								</span>
								<p className="rounded-md border border-border bg-bg-base px-3 py-2.5 font-mono text-small text-text-primary">
									{editingRow?.key}
								</p>
							</div>
							<label className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Value
								</span>
								<input
									className={inputClassName}
									value={value}
									onChange={(ev) => setValue(ev.target.value)}
									placeholder="200"
								/>
							</label>
							<label className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Description
								</span>
								<textarea
									className={`${inputClassName} min-h-[88px] resize-y py-2`}
									value={description}
									onChange={(ev) => setDescription(ev.target.value)}
									placeholder="Describe this multiplier or threshold."
								/>
							</label>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}

MmrAsymmetryConfigTable.displayName = "MmrAsymmetryConfigTable";
