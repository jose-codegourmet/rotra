"use client";

import { useState } from "react";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { Button } from "@/components/ui/button/Button";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";
import { formatEnumLabel } from "../../../../lib/utils/customer-detail-display-helpers";
import { EditCustomerSkillsFormModal } from "../EditCustomerSkillsFormModal";

export type CustomerSkillsSectionProps = {
	profile: CustomerProfileSerialized;
};

function DetailField({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
			<dt className="text-label uppercase text-text-secondary">{label}</dt>
			<dd className="text-body text-text-primary">{value}</dd>
		</div>
	);
}

export function CustomerSkillsSection({ profile }: CustomerSkillsSectionProps) {
	const [editOpen, setEditOpen] = useState(false);

	return (
		<>
			<PageSection
				title="Skills & preferences"
				description="Playing level, format, court position, and play mode from onboarding."
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<dl className="min-w-0 flex-1 space-y-4 rounded-lg border border-border bg-bg-surface p-6">
						<DetailField
							label="Playing level"
							value={formatEnumLabel(profile.playingLevel)}
						/>
						<DetailField
							label="Format"
							value={formatEnumLabel(profile.formatPreference)}
						/>
						<DetailField
							label="Court position"
							value={formatEnumLabel(profile.courtPosition)}
						/>
						<DetailField
							label="Play mode"
							value={formatEnumLabel(profile.playMode)}
						/>
					</dl>
					<Button
						type="button"
						variant="outline"
						className="shrink-0"
						onClick={() => setEditOpen(true)}
					>
						Edit
					</Button>
				</div>
			</PageSection>
			<EditCustomerSkillsFormModal
				open={editOpen}
				onOpenChange={setEditOpen}
				profile={profile}
			/>
		</>
	);
}

CustomerSkillsSection.displayName = "CustomerSkillsSection";
