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

	if (!profile?.onboardingCompleted) {
		redirect("/onboarding");
	}

	return <DashboardLayout pageTitle="Dashboard">{children}</DashboardLayout>;
}
