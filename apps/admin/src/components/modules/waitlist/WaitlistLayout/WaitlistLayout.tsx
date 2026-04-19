import type { ReactNode } from "react";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";

export type WaitlistLayoutProps = {
	stats: ReactNode;
	table: ReactNode;
};

export function WaitlistLayout({ stats, table }: WaitlistLayoutProps) {
	return (
		<div className="mx-auto max-w-6xl space-y-8">
			{stats}
			<PageSection
				title="Landing waitlist"
				description="Email addresses submitted from the public coming-soon page. Protect this route with admin auth in production."
			>
				{table}
			</PageSection>
		</div>
	);
}

WaitlistLayout.displayName = "WaitlistLayout";
