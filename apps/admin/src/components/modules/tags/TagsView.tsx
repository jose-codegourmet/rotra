"use client";

import { useState } from "react";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { Button } from "@/components/ui/button/Button";
import { useTagDefinitionsQuery } from "@/hooks/useTagDefinitions/client";

import { AddTagDefinitionDialog } from "./AddTagDefinitionDialog";
import { TagDefinitionsTable } from "./TagDefinitionsTable";

export function TagsView({ canMutate }: { canMutate: boolean }) {
	const [addOpen, setAddOpen] = useState(false);
	const { data, isLoading, isError } = useTagDefinitionsQuery();
	const definitions = data?.definitions ?? [];

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Tag definitions"
				description={
					canMutate
						? "Manage the catalog of tags admins may assign to customer profiles."
						: "View active tag definitions available for customer assignment."
				}
			>
				{canMutate ? (
					<div className="flex justify-end">
						<Button type="button" onClick={() => setAddOpen(true)}>
							Add tag definition
						</Button>
					</div>
				) : null}
			</PageSection>

			{isLoading ? (
				<p className="text-body text-text-secondary">
					Loading tag definitions…
				</p>
			) : isError ? (
				<p className="text-body text-red-600">
					Failed to load tag definitions.
				</p>
			) : (
				<TagDefinitionsTable definitions={definitions} canMutate={canMutate} />
			)}

			{canMutate ? (
				<AddTagDefinitionDialog open={addOpen} onOpenChange={setAddOpen} />
			) : null}
		</div>
	);
}
