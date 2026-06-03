"use client";

import { useState } from "react";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { Button } from "@/components/ui/button/Button";
import { useRemoveProfileTag } from "@/hooks/useCustomerTags/client";
import { cn } from "@/lib/utils/tailwind";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { AddCustomerTagFormModal } from "../AddCustomerTagFormModal";

export type CustomerTagsSectionProps = {
	profile: CustomerProfileSerialized;
	callerIsSuperAdmin: boolean;
};

export function CustomerTagsSection({
	profile,
	callerIsSuperAdmin,
}: CustomerTagsSectionProps) {
	const [addOpen, setAddOpen] = useState(false);
	const removeTag = useRemoveProfileTag(profile.id);

	return (
		<>
			<PageSection
				title="Tags"
				description="Internal labels from the tag catalog for cohorts, beta access, and filtering."
			>
				<div className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
					<div className="flex flex-wrap items-center gap-2">
						{profile.tags.length === 0 ? (
							<p className="text-body text-text-secondary">No tags yet.</p>
						) : (
							profile.tags.map((tag) => (
								<span
									key={tag.id}
									className={cn(
										"inline-flex items-center gap-1 rounded-full border border-border",
										"bg-bg-elevated px-3 py-1 text-small text-text-primary",
									)}
								>
									<span title={tag.slug}>{tag.label}</span>
									<button
										type="button"
										className="rounded p-0.5 text-text-secondary hover:bg-bg-surface hover:text-text-primary disabled:opacity-50"
										disabled={removeTag.isPending}
										aria-label={`Remove tag ${tag.label}`}
										onClick={() => {
											if (removeTag.isPending) return;
											removeTag.mutate(tag.id);
										}}
									>
										×
									</button>
								</span>
							))
						)}
					</div>
					<Button
						type="button"
						variant="outline"
						onClick={() => setAddOpen(true)}
					>
						Add tag
					</Button>
				</div>
			</PageSection>
			<AddCustomerTagFormModal
				open={addOpen}
				onOpenChange={setAddOpen}
				profileId={profile.id}
				callerIsSuperAdmin={callerIsSuperAdmin}
			/>
		</>
	);
}

CustomerTagsSection.displayName = "CustomerTagsSection";
