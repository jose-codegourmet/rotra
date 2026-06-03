"use client";

import type { TesterDirectoryStatus } from "@rotra/db/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/Button";
import { testerProfilePath } from "@/constants/admin";
import {
	useResendTesterInvite,
	useRevokeTesterInvite,
} from "@/hooks/useTesters/client";
import type { TestersListQueryFilters } from "@/hooks/useTesters/queryKey";
import type { TesterDirectoryRowSerialized } from "@/hooks/useTesters/server";

import { TesterInvitationStatusPill } from "./TesterInvitationStatusPill";

export function TestersTable({
	rows,
	listFilters,
}: {
	rows: TesterDirectoryRowSerialized[];
	listFilters: TestersListQueryFilters;
}) {
	const router = useRouter();

	if (rows.length === 0) {
		return <p className="text-body text-text-secondary">No testers found.</p>;
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table className="w-full min-w-[720px] text-left text-body">
				<thead className="border-b border-border bg-bg-elevated text-label uppercase text-text-secondary">
					<tr>
						<th className="px-4 py-3">Name</th>
						<th className="px-4 py-3">Email</th>
						<th className="px-4 py-3">Status</th>
						<th className="px-4 py-3">Invited by</th>
						<th className="px-4 py-3">Invited at</th>
						<th className="px-4 py-3">Actions</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<TesterTableRow
							key={row.id}
							row={row}
							listFilters={listFilters}
							onRowClick={() => router.push(testerProfilePath(row.id))}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

function TesterTableRow({
	row,
	listFilters,
	onRowClick,
}: {
	row: TesterDirectoryRowSerialized;
	listFilters: TestersListQueryFilters;
	onRowClick: () => void;
}) {
	const resend = useResendTesterInvite(row.id, listFilters);
	const revoke = useRevokeTesterInvite(row.id, listFilters);
	const status = row.status as TesterDirectoryStatus;
	const showResend = status === "pending" || status === "expired";
	const showRevoke = status === "pending";

	return (
		<tr
			className="cursor-pointer border-b border-border last:border-0 hover:bg-bg-elevated/50"
			onClick={onRowClick}
		>
			<td className="px-4 py-3">
				<Link
					href={testerProfilePath(row.id)}
					className="font-medium text-accent hover:underline"
					onClick={(e) => e.stopPropagation()}
				>
					{row.name}
				</Link>
			</td>
			<td className="px-4 py-3 text-text-secondary">{row.email ?? "—"}</td>
			<td className="px-4 py-3">
				<TesterInvitationStatusPill status={status} />
			</td>
			<td className="px-4 py-3">{row.invitedByName ?? "—"}</td>
			<td className="px-4 py-3 text-text-secondary">
				{row.invitedAt ? new Date(row.invitedAt).toLocaleString() : "—"}
			</td>
			<td className="px-4 py-3">
				<div className="flex flex-wrap gap-2">
					{showResend ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={resend.isPending}
							onClick={(e) => {
								e.stopPropagation();
								resend.mutate();
							}}
						>
							Resend
						</Button>
					) : null}
					{showRevoke ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={revoke.isPending}
							onClick={(e) => {
								e.stopPropagation();
								revoke.mutate();
							}}
						>
							Revoke
						</Button>
					) : null}
				</div>
			</td>
		</tr>
	);
}
