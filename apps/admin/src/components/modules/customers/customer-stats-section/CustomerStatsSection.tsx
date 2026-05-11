import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

export type CustomerStatsSectionProps = {
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

export function CustomerStatsSection({ profile }: CustomerStatsSectionProps) {
	return (
		<PageSection title="Stats" description="MMR and progression (read-only).">
			<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
				<DetailField label="MMR" value={String(profile.mmr)} />
				<DetailField
					label="Matches played"
					value={String(profile.mmrMatchesPlayed)}
				/>
				<DetailField label="EXP total" value={String(profile.expTotal)} />
			</dl>
		</PageSection>
	);
}

CustomerStatsSection.displayName = "CustomerStatsSection";
