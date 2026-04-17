import { comingSoonMeta } from "@/app/constants/coming-soon";
import { GoToWaitlist } from "@/components/coming-soon/GoToWaitlist/GoToWaitlist";
import { cn } from "@/lib/utils";

export function LandingNav() {
	return (
		<header className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-bg-surface/70 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-20 md:px-6">
				<div className="flex items-center gap-3">
					<div className="text-accent" aria-hidden>
						<svg
							className="size-8"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							role="img"
							aria-label="ROTRA mark"
						>
							<title>ROTRA mark</title>
							<path
								d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
								fill="currentColor"
							/>
						</svg>
					</div>
					<span className="font-bold text-lg tracking-tight text-text-primary md:text-xl">
						ROTRA
					</span>
				</div>
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
