import { ArrowDown } from "lucide-react";

import {
	comingSoonMeta,
	secondaryCtaSection,
} from "@/app/constants/coming-soon";
import { BlurRevealText } from "@/components/coming-soon/BlurRevealText/BlurRevealText";
import { GoToWaitlist } from "@/components/coming-soon/GoToWaitlist/GoToWaitlist";
import { cn } from "@/lib/utils";

const goToWaitlistOutlineClass = cn(
	"inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border-[1.5px] border-border-strong bg-transparent px-8 py-3 text-label uppercase tracking-wide text-text-primary shadow-none transition-colors",
	"hover:bg-bg-elevated",
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
);

export function SecondaryCta() {
	return (
		<section
			className="relative overflow-hidden border-t border-border bg-bg-surface/40 px-4 py-16 md:px-6 md:py-20"
			aria-labelledby="secondary-cta-title"
		>
			<div
				className="pointer-events-none absolute -top-px left-1/2 h-48 w-[min(100%,540px)] -translate-x-1/2 bg-accent/10 blur-3xl"
				aria-hidden
			/>
			<div className="relative mx-auto max-w-[720px]">
				<div className="rounded-2xl border border-border bg-bg-surface/50 p-8 text-center shadow-card md:p-10">
					<p className="text-label uppercase tracking-widest text-accent">
						<BlurRevealText
							display="inline"
							className="text-label uppercase tracking-widest"
						>
							{secondaryCtaSection.eyebrow}
						</BlurRevealText>
					</p>
					<h2
						id="secondary-cta-title"
						className="mt-3 text-title text-2xl font-semibold tracking-tight text-text-primary md:text-3xl"
					>
						<BlurRevealText
							display="inline"
							className="text-title font-semibold"
						>
							{secondaryCtaSection.title}
						</BlurRevealText>
					</h2>
					<p className="mt-4 text-body text-text-secondary">
						<BlurRevealText
							display="block"
							className="text-body text-text-secondary justify-center text-center w-full mx-auto max-w-xs"
						>
							{secondaryCtaSection.body}
						</BlurRevealText>
					</p>
					<div className="mt-8 flex justify-center">
						<GoToWaitlist className={goToWaitlistOutlineClass}>
							<ArrowDown
								className="size-5 shrink-0"
								strokeWidth={1.5}
								aria-hidden
							/>
							{comingSoonMeta.secondaryCta}
						</GoToWaitlist>
					</div>
				</div>
			</div>
		</section>
	);
}
