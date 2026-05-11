import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

export type CustomerAuditSectionProps = {
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

export function CustomerAuditSection({ profile }: CustomerAuditSectionProps) {
	return (
		<PageSection title="Record" description="Timestamps for this profile.">
			<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
				<DetailField
					label="Joined"
					value={new Date(profile.createdAt).toLocaleString()}
				/>
				<DetailField
					label="Updated"
					value={new Date(profile.updatedAt).toLocaleString()}
				/>
			</dl>
		</PageSection>
	);
}

CustomerAuditSection.displayName = "CustomerAuditSection";
