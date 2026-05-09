import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardLayout } from "@/layouts/DashboardLayout/DashboardLayout";
import { getCurrentProfile } from "@/lib/server/current-profile";

export default async function ProtectedLayout({
	children,
}: {
	children: ReactNode;
}) {
	const profile = await getCurrentProfile();

	const isAdmin = !!profile?.adminRole && profile.adminIsActive;
	if (!isAdmin && !profile?.onboardingCompleted) {
		redirect("/onboarding");
	}

	return (
		<DashboardLayout
			pageTitle="Dashboard"
			adminRole={isAdmin && profile ? profile.adminRole : null}
		>
			{children}
		</DashboardLayout>
	);
}
