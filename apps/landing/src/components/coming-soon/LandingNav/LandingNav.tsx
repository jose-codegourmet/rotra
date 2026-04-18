import Link from "next/link";

import { comingSoonMeta } from "@/app/constants/coming-soon";
import { GoToWaitlist } from "@/components/coming-soon/GoToWaitlist/GoToWaitlist";
import { Button } from "@/components/ui/button/Button";
import { Logo } from "@/components/ui/logo/Logo";
import { cn } from "@/lib/utils";

export function LandingNav() {
	return (
		<header className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-bg-surface/70 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6">
				<Link
					href="/"
					className="inline-flex items-center h-full py-2"
					aria-label="ROTRA home"
				>
					<Logo variant="dark" className="h-full w-[200px]" />
				</Link>
				<GoToWaitlist
					className={cn(
						"rounded-md border-[1.5px] border-border-strong bg-transparent px-4 py-2.5 text-label uppercase tracking-wide text-text-primary",
						"transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
					)}
				>
					{comingSoonMeta.navCta}
				</GoToWaitlist>
			</div>
		</header>
	);
}
