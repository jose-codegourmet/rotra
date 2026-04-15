"use client";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { Input } from "@/components/ui/input/Input";

type NameStepProps = {
	name: string;
	onNameChange: (value: string) => void;
	onNameBlur: () => void;
	nameError: string | null;
};

export function NameStep({
	name,
	onNameChange,
	onNameBlur,
	nameError,
}: NameStepProps) {
	return (
		<StepBlock
			kicker="Step 1 of 8"
			title="Your name"
			subtitle="Shown in queue, leaderboard, and your profile."
		>
			<Input
				value={name}
				onChange={(e) => onNameChange(e.target.value)}
				onBlur={onNameBlur}
				maxLength={40}
				aria-invalid={Boolean(nameError)}
				className="h-12 rounded-lg border-border bg-bg-elevated px-3 text-body text-text-primary"
				placeholder="Your display name"
			/>
			{nameError && <p className="text-small text-error">{nameError}</p>}
		</StepBlock>
	);
}
