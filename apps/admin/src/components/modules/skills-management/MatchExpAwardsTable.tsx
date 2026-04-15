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
	MATCH_EXP_CONFIG_DEFAULT_ROWS,
	type MatchExpConfigRow,
} from "@/constants/match-exp-config";

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent";

const columnHelper = createColumnHelper<MatchExpConfigRow>();

export function MatchExpAwardsTable() {
	const [data, setData] = React.useState<MatchExpConfigRow[]>(() => [
		...MATCH_EXP_CONFIG_DEFAULT_ROWS,
	]);
	const [editingRow, setEditingRow] = React.useState<MatchExpConfigRow | null>(
		null,
	);
	const [defaultAmount, setDefaultAmount] = React.useState("");
	const [eligibility, setEligibility] = React.useState("");

	React.useEffect(() => {
		if (editingRow) {
			setDefaultAmount(editingRow.defaultAmount);
			setEligibility(editingRow.eligibility);
		}
	}, [editingRow]);

	const columns = React.useMemo(
		() => [
			columnHelper.accessor("reason", {
				header: "Reason",
				cell: (info) => (
					<span className="font-mono text-small text-text-primary">
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("defaultAmount", {
				header: "Default",
				cell: (info) => (
					<span className="text-text-secondary">{info.getValue()}</span>
				),
			}),
			columnHelper.accessor("eligibility", {
				header: "Eligibility",
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
					? {
							...r,
							defaultAmount: defaultAmount.trim(),
							eligibility: eligibility.trim(),
						}
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
							<DialogTitle>Edit match EXP award</DialogTitle>
							<DialogDescription>
								Updates a mock row in this directory only — no API yet. Changes
								apply to future transactions in product; this UI does not
								persist.
							</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col gap-4 py-2">
							<div className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Reason
								</span>
								<p className="rounded-md border border-border bg-bg-base px-3 py-2.5 font-mono text-small text-text-primary">
									{editingRow?.reason}
								</p>
							</div>
							<label className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Default amount
								</span>
								<input
									className={inputClassName}
									value={defaultAmount}
									onChange={(ev) => setDefaultAmount(ev.target.value)}
									placeholder="+10"
								/>
							</label>
							<label className="flex flex-col gap-1">
								<span className="text-label uppercase text-text-secondary">
									Eligibility
								</span>
								<input
									className={inputClassName}
									value={eligibility}
									onChange={(ev) => setEligibility(ev.target.value)}
									placeholder="MMR club queue only"
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

MatchExpAwardsTable.displayName = "MatchExpAwardsTable";
