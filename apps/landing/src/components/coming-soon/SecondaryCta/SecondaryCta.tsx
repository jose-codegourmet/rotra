import { comingSoonMeta } from "@/app/constants/coming-soon";
import { GoToWaitlist } from "@/components/coming-soon/GoToWaitlist/GoToWaitlist";

export function SecondaryCta() {
	return (
		<section
			className="border-t border-border px-4 py-14 md:px-6 md:py-16"
			aria-label="Secondary call to action"
		>
			<div className="mx-auto flex max-w-[480px] flex-col items-center gap-4 text-center">
				<GoToWaitlist className="rounded-md border-[1.5px] border-border-strong bg-transparent px-8 py-3 text-label uppercase tracking-wide text-text-primary transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base">
					{comingSoonMeta.secondaryCta}
				</GoToWaitlist>
			</div>
		</section>
	);
}
