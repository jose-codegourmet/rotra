"use client";

import { Button } from "@/components/ui/button/Button";
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
	const actionable = rows.filter(
		(r) => r.status === "pending" || r.status === "in_review",
	);
	const allActionableSelected =
		actionable.length > 0 &&
		actionable.every((r) => selectedIds.has(r.id));

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-3 text-small">
				<label className="flex items-center gap-2">
					<span className="text-text-secondary">Status</span>
					<select
						className="rounded-md border border-border bg-bg-surface px-2 py-1.5"
						value={status ?? ""}
						onChange={(e) =>
							onStatusChange(
								e.target.value === "" ? undefined : e.target.value,
							)
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
							<tr>
								<th className="px-2 py-2 w-10">
									<input
										type="checkbox"
										className="rounded border-border"
										checked={allActionableSelected}
										onChange={(e) =>
											onToggleSelectAllOnPage(
												actionable.map((r) => r.id),
												e.target.checked,
											)
										}
										aria-label="Select all actionable on page"
									/>
								</th>
								<th className="px-2 py-2">Applicant</th>
								<th className="px-2 py-2">Club</th>
								<th className="px-2 py-2">City</th>
								<th className="px-2 py-2">Status</th>
								<th className="px-2 py-2">SLA</th>
								<th className="px-2 py-2">
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
								</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => {
								const selectable =
									row.status === "pending" || row.status === "in_review";
								return (
									<tr
										key={row.id}
										className={`border-b border-border last:border-0 cursor-pointer hover:bg-bg-elevated/60 ${
											selectedId === row.id ? "bg-bg-elevated" : ""
										}`}
										onClick={() => onSelectRow(row)}
									>
										<td
											className="px-2 py-2"
											onClick={(e) => e.stopPropagation()}
										>
											<input
												type="checkbox"
												className="rounded border-border"
												disabled={!selectable}
												checked={selectedIds.has(row.id)}
												onChange={(e) =>
													onToggleSelect(row.id, e.target.checked)
												}
												aria-label={`Select ${row.clubName}`}
											/>
										</td>
										<td className="px-2 py-2">
											<div className="font-medium text-text-primary">
												{row.applicantName}
											</div>
											<div className="text-text-secondary text-micro">
												{row.applicantEmail}
											</div>
										</td>
										<td className="px-2 py-2 text-text-primary">{row.clubName}</td>
										<td className="px-2 py-2 text-text-secondary">
											{row.locationCity}
										</td>
										<td className="px-2 py-2">
											<ApplicationStatusPill status={row.status} />
										</td>
										<td className="px-2 py-2 text-text-secondary whitespace-nowrap">
											{formatSlaRemaining(row)}
										</td>
										<td className="px-2 py-2 text-text-secondary whitespace-nowrap">
											{new Date(row.updatedAt).toLocaleString()}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : null}
		</div>
	);
}
