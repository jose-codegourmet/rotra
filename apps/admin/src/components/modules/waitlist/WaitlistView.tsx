"use client";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";

import { AdminWaitlistTable } from "./AdminWaitlistTable";

export function WaitlistView() {
	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Landing waitlist"
				description="Email addresses submitted from the public coming-soon page. Protect this route with admin auth in production."
			>
				<AdminWaitlistTable />
			</PageSection>
		</div>
	);
}
