"use client";

import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import type { KillSwitchRow } from "@/constants/mock-admin-pages";
import { cn } from "@/lib/utils";

export function KillSwitchesPanel({
	rows: initialRows,
}: {
	rows: KillSwitchRow[];
}) {
	const [rows, setRows] = React.useState(initialRows);

	return (
		<div className="overflow-x-auto rounded-lg border border-border bg-bg-surface">
			<table className="w-full min-w-[880px] text-left text-small">
				<thead>
					<tr className="border-b border-border bg-bg-base">
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Feature
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Key
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Category
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							State
						</th>
						<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
							Toggle
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr
							key={row.id}
							className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
						>
							<td className="px-4 py-3 align-top">
								<p className="font-medium text-text-primary">{row.label}</p>
								<p className="mt-1 max-w-md text-text-secondary">
									{row.description}
								</p>
							</td>
							<td className="px-4 py-3 align-middle font-mono text-micro text-text-secondary">
								{row.key}
							</td>
							<td className="px-4 py-3 align-middle text-text-secondary">
								{row.category}
							</td>
							<td className="px-4 py-3 align-middle">
								<span
									className={cn(
										"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
										row.enabled
											? "border border-accent/40 bg-accent-subtle text-accent"
											: "border border-border bg-bg-elevated text-text-secondary",
									)}
								>
									{row.enabled ? "On" : "Off"}
								</span>
							</td>
							<td className="px-4 py-3 align-middle">
								<Button
									type="button"
									variant={row.enabled ? "secondary" : "default"}
									size="sm"
									className="min-h-11 min-w-24"
									onClick={() =>
										setRows((prev) =>
											prev.map((r) =>
												r.id === row.id ? { ...r, enabled: !r.enabled } : r,
											),
										)
									}
								>
									{row.enabled ? "Turn off" : "Turn on"}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

KillSwitchesPanel.displayName = "KillSwitchesPanel";
