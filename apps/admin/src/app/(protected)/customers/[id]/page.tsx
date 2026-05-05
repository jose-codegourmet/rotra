import { CustomerProfileError, db, getCustomerProfileDetail } from "@rotra/db";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { CustomerDetailActions } from "@/components/modules/customers/customer-detail-actions/CustomerDetailActions";
import { ROUTES } from "@/constants/admin";
import { playerProfileUrl } from "@/lib/client-app-url";
import { cn } from "@/lib/utils";

type PageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	try {
		const profile = await getCustomerProfileDetail(db, id);
		return {
			title: `${profile.name} — ROTRA Admin`,
		};
	} catch {
		return { title: "Customer — ROTRA Admin" };
	}
}

function DetailField({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
			<dt className="text-label uppercase text-text-secondary">{label}</dt>
			<dd className="text-body text-text-primary">{value}</dd>
		</div>
	);
}

function optionalLabel(value: string | null): string {
	return value ?? "—";
}

export default async function CustomerDetailPage({ params }: PageProps) {
	const { id } = await params;

	let profile: Awaited<ReturnType<typeof getCustomerProfileDetail>>;
	try {
		profile = await getCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof CustomerProfileError) notFound();
		throw error;
	}

	const clientProfileUrl = playerProfileUrl(id);
	const moderationHref = `${ROUTES.MODERATION}?tab=accounts&player=${encodeURIComponent(id)}`;

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<div>
				<Link
					href={ROUTES.CUSTOMERS}
					className="text-small text-accent hover:underline"
				>
					← Back to directory
				</Link>
			</div>

			<PageSection
				title={profile.name}
				description="Player profile (read-only). Verification and onboarding reflect Client App state."
			>
				<div className="space-y-6">
					<CustomerDetailActions
						moderationHref={moderationHref}
						clientProfileUrl={clientProfileUrl}
					/>
					<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
						<DetailField label="Player ID" value={profile.id} />
						<DetailField label="Email" value={optionalLabel(profile.email)} />
						<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
							<dt className="text-label uppercase text-text-secondary">
								Verified
							</dt>
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
						<DetailField label="MMR" value={String(profile.mmr)} />
						<DetailField
							label="Matches played"
							value={String(profile.mmrMatchesPlayed)}
						/>
						<DetailField
							label="Playing level"
							value={optionalLabel(profile.playingLevel)}
						/>
						<DetailField
							label="Format"
							value={optionalLabel(profile.formatPreference)}
						/>
						<DetailField
							label="Court position"
							value={optionalLabel(profile.courtPosition)}
						/>
						<DetailField
							label="Play mode"
							value={optionalLabel(profile.playMode)}
						/>
						<DetailField label="EXP total" value={String(profile.expTotal)} />
						<DetailField
							label="Onboarding"
							value={profile.onboardingCompleted ? "Complete" : "Incomplete"}
						/>
						<DetailField
							label="Joined"
							value={profile.createdAt.toLocaleString()}
						/>
						<DetailField
							label="Updated"
							value={profile.updatedAt.toLocaleString()}
						/>
					</dl>
				</div>
			</PageSection>
		</div>
	);
}
