"use client";

import { ChipRow } from "@/components/modules/onboarding/ChipRow/ChipRow";
import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";

type ChoiceStepProps<T extends string> = {
	kicker: string;
	title: string;
	subtitle: string;
	value: T | "";
	options: { v: T; label: string }[];
	onChange: (value: T) => void;
	helperText?: string;
};

export function ChoiceStep<T extends string>({
	kicker,
	title,
	subtitle,
	value,
	options,
	onChange,
	helperText,
}: ChoiceStepProps<T>) {
	return (
		<StepBlock kicker={kicker} title={title} subtitle={subtitle}>
			<ChipRow value={value} onChange={onChange} options={options} />
			{helperText ? (
				<p className="mt-3 text-small text-text-secondary">{helperText}</p>
			) : null}
		</StepBlock>
	);
}
