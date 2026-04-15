import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo/Logo";
import { getCurrentProfile } from "@/lib/server/current-profile";

export default async function OnboardingShellLayout({
	children,
}: {
	children: ReactNode;
}) {
	const profile = await getCurrentProfile();

	if (profile?.onboardingCompleted) {
		redirect("/home");
	}

	return (
		<div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
			<header className="flex h-14 shrink-0 items-center border-b border-border px-4 md:px-6">
				<Logo variant="dark" className="h-7 w-auto" />
			</header>
			<div className="flex flex-1 flex-col">{children}</div>
		</div>
	);
}
