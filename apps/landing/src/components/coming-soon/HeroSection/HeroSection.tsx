import Image from "next/image";

import { comingSoonMeta, heroImage } from "@/app/constants/coming-soon";
import { BlurRevealText } from "@/components/coming-soon/BlurRevealText/BlurRevealText";
import { HeroVeil } from "@/components/coming-soon/HeroVeil/HeroVeil";
import { WaitlistForm } from "@/components/coming-soon/WaitlistForm/WaitlistForm";

export function HeroSection() {
	return (
		<section
			id="waitlist"
			aria-labelledby="waitlist-heading"
			className="relative flex min-h-[min(100dvh,920px)] items-center justify-center overflow-hidden"
		>
			<h2 id="waitlist-heading" className="sr-only">
				Join the waitlist
			</h2>
			<div className="absolute inset-0 z-0">
				<Image
					src={heroImage.src}
					alt={heroImage.alt}
					fill
					className="object-cover"
					priority
					sizes="100vw"
				/>
				<HeroVeil />
				<div
					className="absolute inset-0 z-[2] bg-gradient-to-b from-bg-base/55 via-bg-base/80 to-bg-base"
					aria-hidden
				/>
			</div>
			<div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-12 pt-24 text-center md:px-6 md:pt-28">
				<div className="mb-6 inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full border-[1.5px] border-border-strong/40 bg-bg-surface/50 px-3 py-1">
					<span className="size-2 rounded-full bg-accent" aria-hidden />
					<span className="text-micro uppercase tracking-widest text-accent">
						<BlurRevealText display="inline">
							{comingSoonMeta.badge}
						</BlurRevealText>
					</span>
				</div>
				<h1 className="max-w-4xl text-balance font-bold text-4xl leading-[1.1] tracking-tight text-text-primary md:text-6xl lg:text-7xl">
					<BlurRevealText
						segments={[
							{ text: comingSoonMeta.headlineLead },
							{ text: comingSoonMeta.headlineAccent, className: "text-accent" },
						]}
					/>
				</h1>
				<p className="mt-6 max-w-xl text-body text-text-secondary md:text-lg">
					<BlurRevealText display="block" className="text-body md:text-lg">
						{comingSoonMeta.subcopy}
					</BlurRevealText>
				</p>
				<p className="mt-3 text-small font-medium text-text-primary">
					<BlurRevealText display="inline" className="text-small font-medium">
						{comingSoonMeta.tagline}
					</BlurRevealText>
				</p>
				<div className="mt-10 flex w-full flex-col items-center">
					<WaitlistForm />
					<p className="mt-4 max-w-xl text-center text-micro uppercase tracking-widest text-text-secondary">
						{comingSoonMeta.waitlistFinePrint}
					</p>
				</div>
			</div>
		</section>
	);
}
