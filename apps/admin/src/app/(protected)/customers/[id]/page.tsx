import { CustomerProfileError, db, getCustomerProfileDetail } from "@rotra/db";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { CustomerAuditSection } from "@/components/modules/customers/customer-audit-section/CustomerAuditSection";
import { CustomerBasicInfoSection } from "@/components/modules/customers/customer-basic-info-section/CustomerBasicInfoSection";
import { CustomerDetailActions } from "@/components/modules/customers/customer-detail-actions/CustomerDetailActions";
import { CustomerSkillsSection } from "@/components/modules/customers/customer-skills-section/CustomerSkillsSection";
import { CustomerStatsSection } from "@/components/modules/customers/customer-stats-section/CustomerStatsSection";
import { CustomerTagsSection } from "@/components/modules/customers/customer-tags-section/CustomerTagsSection";
import { CustomerVerificationSection } from "@/components/modules/customers/customer-verification-section/CustomerVerificationSection";
import { ROUTES } from "@/constants/admin";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { playerProfileUrl } from "@/lib/client-app-url";
import { serializeCustomerProfileForClient } from "@/types/customer-profile-serialized";

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

export default async function CustomerDetailPage({ params }: PageProps) {
	const { id } = await params;
	const session = await requireAdminSession();
	const callerIsSuperAdmin = session.adminRole === "super_admin";

	let profile: Awaited<ReturnType<typeof getCustomerProfileDetail>>;
	try {
		profile = await getCustomerProfileDetail(db, id);
	} catch (error) {
		if (error instanceof CustomerProfileError) notFound();
		throw error;
	}

	const serialized = serializeCustomerProfileForClient(profile);
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
				description="Player profile. Basic info and preferences can be edited here; verification reflects Client App state."
			>
				<div className="space-y-6">
					<CustomerDetailActions
						moderationHref={moderationHref}
						clientProfileUrl={clientProfileUrl}
					/>
				</div>
			</PageSection>

			<CustomerBasicInfoSection profile={serialized} />
			<CustomerSkillsSection profile={serialized} />
			<CustomerTagsSection
				profile={serialized}
				callerIsSuperAdmin={callerIsSuperAdmin}
			/>
			<CustomerVerificationSection profile={serialized} />
			<CustomerStatsSection profile={serialized} />
			<CustomerAuditSection profile={serialized} />
		</div>
	);
}
