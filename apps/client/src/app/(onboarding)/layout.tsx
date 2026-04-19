import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import DarkVeil from "@/components/ui/dark-veil/DarkVeil";
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
		<div className="relative flex min-h-screen flex-col overflow-hidden text-text-primary">
			<div className="absolute inset-0 z-0 bg-[#0e0e0f]">
				<DarkVeil speed={1.4} hueShift={78} />
			</div>

			<div
				className="pointer-events-none absolute inset-0 z-[1]"
				style={{ background: "rgba(0,0,0,0.52)" }}
			/>

			<div className="pointer-events-none absolute inset-0 z-[1]">
				<div
					className="absolute left-1/4 top-1/3 h-[min(560px,70vh)] w-[min(560px,55vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
					style={{ background: "rgba(0,255,136,0.06)" }}
				/>
				<div
					className="absolute bottom-1/4 right-1/4 h-[360px] w-[360px] rounded-full blur-3xl"
					style={{ background: "rgba(0,204,106,0.05)" }}
				/>
			</div>

			<div className="relative z-10 flex min-h-screen flex-col">
				<header className="flex h-14 shrink-0 items-center border-b border-white/10 bg-bg-base/55 px-4 backdrop-blur-md md:px-6">
					<Logo variant="dark" className="h-7 w-auto" />
				</header>
				<div className="flex flex-1 flex-col">{children}</div>
			</div>
		</div>
	);
}
