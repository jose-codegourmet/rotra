"use client";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import type { OnboardingPayload } from "@/lib/onboarding/validate-payload";
import { cn } from "@/lib/utils";

type LevelValue = OnboardingPayload["playing_level"];

type LevelStepProps = {
	playingLevel: LevelValue | "";
	onPlayingLevelChange: (value: LevelValue) => void;
};

const LEVEL_OPTIONS: { v: LevelValue; label: string }[] = [
	{ v: "beginner", label: "Beginner" },
	{ v: "intermediate", label: "Intermediate" },
	{ v: "advanced", label: "Advanced" },
];

export function LevelStep({
	playingLevel,
	onPlayingLevelChange,
}: LevelStepProps) {
	return (
		<StepBlock
			kicker="Step 4 of 8"
			title="Your level"
			subtitle="Self-declared — helps until ratings build up."
		>
			<div className="flex flex-col gap-3">
				{LEVEL_OPTIONS.map((opt) => (
					<button
						key={opt.v}
						type="button"
						onClick={() => onPlayingLevelChange(opt.v)}
						className={cn(
							"min-h-[44px] w-full rounded-xl border p-4 text-left text-body transition-colors",
							playingLevel === opt.v
								? "border-accent bg-accent/10 text-accent"
								: "border-border bg-bg-surface text-text-primary",
						)}
					>
						{opt.label}
					</button>
				))}
			</div>
		</StepBlock>
	);
}
