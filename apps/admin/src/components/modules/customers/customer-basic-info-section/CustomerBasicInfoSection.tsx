"use client";

import { useState } from "react";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { Button } from "@/components/ui/button/Button";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";
import { optionalText } from "../../../../lib/utils/customer-detail-display-helpers";
import { EditCustomerBasicInfoFormModal } from "../EditCustomerBasicInfoFormModal";

export type CustomerBasicInfoSectionProps = {
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

export function CustomerBasicInfoSection({
	profile,
}: CustomerBasicInfoSectionProps) {
	const [editOpen, setEditOpen] = useState(false);

	return (
		<>
			<PageSection
				title="Basic information"
				description="Name, email, and phone. Edits sync to the database immediately."
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<dl className="min-w-0 flex-1 space-y-4 rounded-lg border border-border bg-bg-surface p-6">
						<DetailField label="Player ID" value={profile.id} />
						<DetailField label="Name" value={profile.name} />
						<DetailField label="Email" value={optionalText(profile.email)} />
						<DetailField label="Phone" value={optionalText(profile.phone)} />
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
			<EditCustomerBasicInfoFormModal
				open={editOpen}
				onOpenChange={setEditOpen}
				profile={profile}
			/>
		</>
	);
}

CustomerBasicInfoSection.displayName = "CustomerBasicInfoSection";
