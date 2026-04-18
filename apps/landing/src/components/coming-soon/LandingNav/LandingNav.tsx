import Link from "next/link";

import { comingSoonMeta } from "@/app/constants/coming-soon";
import { GoToWaitlist } from "@/components/coming-soon/GoToWaitlist/GoToWaitlist";
import { Logo } from "@/components/ui/logo/Logo";
import { cn } from "@/lib/utils";

const navCtaButtonClass = cn(
	"rounded-md border-[1.5px] border-border-strong bg-transparent px-4 py-2.5 text-label uppercase tracking-wide text-text-primary",
	"transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
);

export function LandingNav() {
	return (
		<>
			<header className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-bg-surface/70 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6">
					<Link
						href="/"
						className="flex h-full min-w-0 flex-1 items-center py-2 md:flex-none"
						aria-label="ROTRA home"
					>
						<Logo variant="dark" className="h-[50px] w-full md:w-[250px]" />
					</Link>
					<GoToWaitlist
						className={cn("hidden md:inline-flex", navCtaButtonClass)}
					>
						{comingSoonMeta.navCta}
					</GoToWaitlist>
				</div>
			</header>

			<nav
				className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-bg-surface/70 backdrop-blur-xl md:hidden"
				aria-label="Early access"
			>
				<div className="mx-auto max-w-[1440px] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
					<GoToWaitlist className={cn("w-full", navCtaButtonClass)}>
						{comingSoonMeta.navCta}
					</GoToWaitlist>
				</div>
			</nav>
		</>
	);
}
