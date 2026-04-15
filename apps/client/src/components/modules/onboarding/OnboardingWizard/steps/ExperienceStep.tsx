"use client";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { cn } from "@/lib/utils";

type ExperienceStepProps = {
	age: number | "";
	playingLessThanOneYear: boolean;
	playingSinceYear: number | "";
	playingError: string | null;
	years: number[];
	onAgeChange: (value: number | "") => void;
	onToggleLessThanOneYear: () => void;
	onPlayingSinceYearChange: (value: number | "") => void;
};

export function ExperienceStep({
	age,
	playingLessThanOneYear,
	playingSinceYear,
	playingError,
	years,
	onAgeChange,
	onToggleLessThanOneYear,
	onPlayingSinceYearChange,
}: ExperienceStepProps) {
	return (
		<StepBlock
			kicker="Step 3 of 8"
			title="Your experience"
			subtitle="Age stays private. Playing history can appear on your profile."
		>
			<label
				htmlFor="onboarding-age"
				className="text-small font-medium text-text-secondary"
			>
				Age
			</label>
			<select
				id="onboarding-age"
				value={age === "" ? "" : String(age)}
				onChange={(e) =>
					onAgeChange(e.target.value === "" ? "" : Number(e.target.value))
				}
				className="mb-4 h-12 w-full rounded-lg border border-border bg-bg-elevated px-3 text-body text-text-primary"
			>
				<option value="">Select age</option>
				{Array.from({ length: 99 - 13 + 1 }, (_, i) => i + 13).map((value) => (
					<option key={value} value={value}>
						{value}
					</option>
				))}
			</select>
			<label
				htmlFor="onboarding-playing-since"
				className="text-small font-medium text-text-secondary"
			>
				Playing since
			</label>
			<button
				type="button"
				onClick={onToggleLessThanOneYear}
				className={cn(
					"mb-3 min-h-[44px] w-full rounded-lg border text-body transition-colors",
					playingLessThanOneYear
						? "border-accent bg-accent/15 text-accent"
						: "border-border bg-bg-elevated text-text-secondary",
				)}
			>
				Less than 1 year
			</button>
			<select
				id="onboarding-playing-since"
				disabled={playingLessThanOneYear}
				value={playingSinceYear === "" ? "" : String(playingSinceYear)}
				onChange={(e) =>
					onPlayingSinceYearChange(
						e.target.value === "" ? "" : Number(e.target.value),
					)
				}
				className={cn(
					"h-12 w-full rounded-lg border border-border bg-bg-elevated px-3 text-body text-text-primary",
					playingLessThanOneYear && "pointer-events-none opacity-40",
				)}
			>
				<option value="">Select year</option>
				{years.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
			</select>
			{playingError && <p className="text-small text-error">{playingError}</p>}
		</StepBlock>
	);
}
