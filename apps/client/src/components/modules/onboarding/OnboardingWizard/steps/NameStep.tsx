"use client";

import { Controller, useFormContext } from "react-hook-form";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { Field, FieldError, FieldLabel } from "@/components/ui/field/Field";
import { Input } from "@/components/ui/input/Input";
import type { OnboardingFormValues } from "@/lib/onboarding/onboarding-form-schema";

export function NameStep() {
	const { control } = useFormContext<OnboardingFormValues>();

	return (
		<StepBlock
			kicker="Step 1 of 8"
			title="Your name"
			subtitle="Shown in queue, leaderboard, and your profile."
		>
			<Controller
				control={control}
				name="name"
				render={({ field, fieldState }) => {
					const invalid = Boolean(fieldState.error);
					return (
						<Field data-invalid={invalid}>
							<FieldLabel htmlFor="onboarding-name">Display name</FieldLabel>
							<Input
								id="onboarding-name"
								maxLength={40}
								aria-invalid={invalid}
								className="h-12 rounded-lg border-border bg-bg-elevated px-3 text-body text-text-primary"
								placeholder="Your display name"
								{...field}
							/>
							<FieldError errors={[fieldState.error]} />
						</Field>
					);
				}}
			/>
		</StepBlock>
	);
}
