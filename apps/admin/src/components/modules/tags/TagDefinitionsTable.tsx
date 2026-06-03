"use client";

import { RESERVED_TAG_SLUGS } from "@rotra/db/client";
import { useState } from "react";
import type { TagDefinitionSerialized } from "@/hooks/useTagDefinitions/server";
import { cn } from "@/lib/utils/tailwind";

import { EditTagDefinitionDialog } from "./EditTagDefinitionDialog";

function assignableByLabel(
	value: TagDefinitionSerialized["assignableBy"],
): string {
	return value === "super_admin_only" ? "Super admin only" : "Any admin";
}

export function TagDefinitionsTable({
	definitions,
	canMutate,
}: {
	definitions: TagDefinitionSerialized[];
	canMutate: boolean;
}) {
	const [editing, setEditing] = useState<TagDefinitionSerialized | null>(null);

	if (definitions.length === 0) {
		return (
			<p className="text-body text-text-secondary">No tag definitions yet.</p>
		);
	}

	return (
		<>
			<div className="overflow-x-auto rounded-lg border border-border">
				<table className="w-full min-w-[640px] text-left text-body">
					<thead className="border-b border-border bg-bg-elevated text-label uppercase text-text-secondary">
						<tr>
							<th className="px-4 py-3">Slug</th>
							<th className="px-4 py-3">Label</th>
							<th className="px-4 py-3">Assignable by</th>
							<th className="px-4 py-3">Active</th>
							<th className="px-4 py-3">Created</th>
							{canMutate ? <th className="px-4 py-3">Actions</th> : null}
						</tr>
					</thead>
					<tbody>
						{definitions.map((def) => {
							const isReserved = RESERVED_TAG_SLUGS.includes(
								def.slug as (typeof RESERVED_TAG_SLUGS)[number],
							);
							return (
								<tr
									key={def.id}
									className="border-b border-border last:border-0"
								>
									<td className="px-4 py-3 font-mono text-sm">{def.slug}</td>
									<td className="px-4 py-3">{def.label}</td>
									<td className="px-4 py-3">
										{assignableByLabel(def.assignableBy)}
									</td>
									<td className="px-4 py-3">
										<span
											className={cn(
												"inline-flex rounded-full px-2 py-0.5 text-label",
												def.isActive
													? "bg-emerald-500/15 text-emerald-700"
													: "bg-bg-elevated text-text-secondary",
											)}
										>
											{def.isActive ? "Yes" : "No"}
										</span>
									</td>
									<td className="px-4 py-3 text-text-secondary">
										{new Date(def.createdAt).toLocaleDateString()}
									</td>
									{canMutate ? (
										<td className="px-4 py-3">
											<button
												type="button"
												className="text-accent hover:underline"
												onClick={() => setEditing(def)}
											>
												Edit
											</button>
											{isReserved ? (
												<span
													className="ml-2 text-text-disabled"
													title="Reserved system tag"
												>
													(cannot deactivate)
												</span>
											) : null}
										</td>
									) : null}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{editing ? (
				<EditTagDefinitionDialog
					definition={editing}
					open={Boolean(editing)}
					onOpenChange={(open) => {
						if (!open) setEditing(null);
					}}
				/>
			) : null}
		</>
	);
}
