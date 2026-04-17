import {
	architectureSection,
	landingModules,
} from "@/app/constants/coming-soon";

import { ModuleIcon } from "@/components/coming-soon/ModuleIcon/ModuleIcon";

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
							{architectureSection.eyebrow}
						</p>
						<h2
							id="architecture-title"
							className="text-title text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
						>
							{architectureSection.title}
						</h2>
					</div>
					<p className="max-w-xs text-small text-text-secondary md:text-right">
						{architectureSection.intro}
					</p>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{landingModules.map((mod) => (
						<article
							key={mod.id}
							className="group rounded-lg border border-border bg-bg-surface/50 p-6 shadow-card md:p-8"
						>
							<div className="mb-6 flex size-12 items-center justify-center rounded-md border border-border bg-bg-elevated/60 text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg-base">
								<ModuleIcon icon={mod.icon} className="size-5" />
							</div>
							<p className="mb-2 text-micro uppercase tracking-widest text-text-secondary">
								Module {mod.id}
							</p>
							<h3 className="mb-3 font-semibold text-lg tracking-tight text-text-primary transition-colors group-hover:text-accent">
								{mod.title}
							</h3>
							<p className="text-small leading-relaxed text-text-secondary">
								{mod.body}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
