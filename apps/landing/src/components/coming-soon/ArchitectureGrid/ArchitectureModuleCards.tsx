"use client";

import type { ViewportOptions } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

import { landingModules } from "@/app/constants/coming-soon";
import { ModuleIcon } from "@/components/coming-soon/ModuleIcon/ModuleIcon";

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.05,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 24,
		filter: "blur(12px)",
	},
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: {
			duration: 0.48,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

const viewport: Pick<ViewportOptions, "once" | "amount"> = {
	once: true,
	amount: 0.25,
};

export function ArchitectureModuleCards() {
	const prefersReducedMotion = useReducedMotion();

	if (prefersReducedMotion) {
		return (
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
		);
	}

	return (
		<motion.div
			className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={viewport}
		>
			{landingModules.map((mod) => (
				<motion.article
					key={mod.id}
					className="group rounded-lg border border-border bg-bg-surface/50 p-6 shadow-card md:p-8"
					variants={itemVariants}
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
				</motion.article>
			))}
		</motion.div>
	);
}
