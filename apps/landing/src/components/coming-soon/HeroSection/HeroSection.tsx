import Image from "next/image";

import { comingSoonMeta, heroImage } from "@/app/constants/coming-soon";
import { HeroVeil } from "@/components/coming-soon/HeroVeil/HeroVeil";

export function HeroSection() {
	return (
		<div className="relative min-h-[min(100dvh,920px)] overflow-hidden flex items-center justify-center">
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
						{comingSoonMeta.badge}
					</span>
				</div>
				<h1 className="max-w-4xl text-balance font-bold text-4xl leading-[1.1] tracking-tight text-text-primary md:text-6xl lg:text-7xl">
					<span>{comingSoonMeta.headlineLead}</span>{" "}
					<span className="text-accent">{comingSoonMeta.headlineAccent}</span>
				</h1>
				<p className="mt-6 max-w-xl text-body text-text-secondary md:text-lg">
					{comingSoonMeta.subcopy}
				</p>
				<p className="mt-3 text-small font-medium text-text-primary">
					{comingSoonMeta.tagline}
				</p>
			</div>
		</div>
	);
}
