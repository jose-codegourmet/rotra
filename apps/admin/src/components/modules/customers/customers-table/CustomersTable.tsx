"use client";

import Link from "next/link";

import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import { customerProfilePath } from "@/constants/admin";
import type { CustomerDirectoryRowSerialized } from "@/hooks/useCustomers/server";
import { cn } from "@/lib/utils";

export type CustomersTableProps = {
	rows: CustomerDirectoryRowSerialized[];
	className?: string;
};

function formatCreatedAt(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString();
	} catch {
		return iso;
	}
}

export function CustomersTable({ rows, className }: CustomersTableProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<PageTable minWidthClassName="min-w-[720px]">
				<thead>
					<tr className="border-b border-border bg-bg-base">
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Name
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Email
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Verified
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							MMR
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Joined
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.length === 0 ? (
						<tr>
							<td
								colSpan={5}
								className="px-4 py-8 text-center text-small text-text-secondary"
							>
								No players match this search.
							</td>
						</tr>
					) : (
						rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
							>
								<td className="px-4 py-3">
									<Link
										href={customerProfilePath(row.id)}
										className="font-medium text-accent hover:underline"
									>
										{row.name}
									</Link>
								</td>
								<td className="max-w-[220px] truncate px-4 py-3 text-text-secondary">
									{row.email ?? "—"}
								</td>
								<td className="px-4 py-3 text-text-secondary">
									{row.isVerified ? "Yes" : "No"}
								</td>
								<td className="px-4 py-3 text-text-secondary">{row.mmr}</td>
								<td className="px-4 py-3 text-text-secondary">
									{formatCreatedAt(row.createdAt)}
								</td>
							</tr>
						))
					)}
				</tbody>
			</PageTable>
		</div>
	);
}

CustomersTable.displayName = "CustomersTable";
