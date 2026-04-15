"use client";

import { cn } from "@/lib/utils";

type ProgressDotsProps = {
	currentStep: number;
	totalSteps?: number;
};

export function ProgressDots({
	currentStep,
	totalSteps = 8,
}: ProgressDotsProps) {
	if (currentStep < 1) return null;

	return (
		<div className="flex items-center justify-end gap-1.5 border-b border-border px-4 py-3 md:px-8">
			{Array.from({ length: totalSteps }, (_, i) => {
				const idx = i + 1;
				const active = currentStep === idx;
				const done = currentStep > idx;
				return (
					<span
						key={idx}
						className={cn(
							"size-2 rounded-full",
							active && "bg-accent",
							done && !active && "bg-accent-dim",
							!done && !active && "bg-bg-elevated",
						)}
						aria-hidden
					/>
				);
			})}
		</div>
	);
}
