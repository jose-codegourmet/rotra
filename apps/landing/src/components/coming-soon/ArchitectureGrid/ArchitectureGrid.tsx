import { architectureSection } from "@/app/constants/coming-soon";
import { ArchitectureModuleCards } from "@/components/coming-soon/ArchitectureGrid/ArchitectureModuleCards";
import { BlurRevealText } from "@/components/coming-soon/BlurRevealText/BlurRevealText";

export function ArchitectureGrid() {
	return (
		<section
			className="relative overflow-hidden bg-bg-base px-4 py-16 md:px-6 md:py-24"
			aria-labelledby="architecture-title"
		>
			<div className="mx-auto max-w-[1440px]">
				<div className="mb-12 flex flex-col gap-8 border-l-[3px] border-accent pl-6 md:mb-16 md:flex-row md:items-end md:justify-between md:pl-8">
					<div className="max-w-xl space-y-3">
						<p className="text-label uppercase tracking-widest text-accent">
							<BlurRevealText
								display="inline"
								className="text-label uppercase tracking-widest"
							>
								{architectureSection.eyebrow}
							</BlurRevealText>
						</p>
						<h2
							id="architecture-title"
							className="text-title text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
						>
							<BlurRevealText
								display="inline"
								className="text-title font-semibold"
							>
								{architectureSection.title}
							</BlurRevealText>
						</h2>
					</div>
					<p className="max-w-xs text-small text-text-secondary md:text-right">
						<BlurRevealText
							display="block"
							className="text-small md:text-right"
						>
							{architectureSection.intro}
						</BlurRevealText>
					</p>
				</div>
				<ArchitectureModuleCards />
			</div>
		</section>
	);
}
