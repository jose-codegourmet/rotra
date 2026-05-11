import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { cn } from "@/lib/utils/tailwind";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

export type CustomerVerificationSectionProps = {
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

export function CustomerVerificationSection({
	profile,
}: CustomerVerificationSectionProps) {
	return (
		<PageSection
			title="Verification"
			description="Derived and email flags reflect Client App and auth state (read-only here)."
		>
			<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
				<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
					<dt className="text-label uppercase text-text-secondary">Verified</dt>
					<dd className="text-body text-text-primary">
						<span
							className={cn(
								"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
								profile.isVerified
									? "border border-accent/40 bg-accent-subtle text-accent"
									: "border border-border bg-bg-elevated text-text-secondary",
							)}
						>
							{profile.isVerified ? "Yes" : "No"}
						</span>
					</dd>
				</div>
				<DetailField
					label="Email verified"
					value={profile.emailVerified ? "Yes" : "No"}
				/>
				<DetailField
					label="Onboarding"
					value={profile.onboardingCompleted ? "Complete" : "Incomplete"}
				/>
			</dl>
		</PageSection>
	);
}

CustomerVerificationSection.displayName = "CustomerVerificationSection";
