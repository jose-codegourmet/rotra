"use client";

import { Controller, useFormContext } from "react-hook-form";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { Field, FieldError, FieldLabel } from "@/components/ui/field/Field";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select/NativeSelect";
import type { OnboardingFormValues } from "@/lib/onboarding/onboarding-form-schema";
import { cn } from "@/lib/utils";

type ExperienceStepProps = {
	years: number[];
};

function parseSelectNumber(value: string): number | "" {
	if (value === "" || value === undefined) {
		return "" as const;
	}
	const n = Number(value);
	return Number.isNaN(n) ? ("" as const) : n;
}

export function ExperienceStep({ years }: ExperienceStepProps) {
	const { control, watch, setValue } = useFormContext<OnboardingFormValues>();

	const playingLessThanOneYear = watch("playing_since_less_than_one_year");

	return (
		<StepBlock
			kicker="Step 3 of 8"
			title="Your experience"
			subtitle="Age stays private. Playing history can appear on your profile."
		>
			<Controller
				control={control}
				name="age"
				render={({ field, fieldState }) => {
					const ageInvalid = Boolean(fieldState.error);
					return (
						<Field data-invalid={ageInvalid}>
							<FieldLabel htmlFor="onboarding-age">Age</FieldLabel>
							<NativeSelect
								id="onboarding-age"
								className={cn("mb-4 w-full", ageInvalid && "aria-invalid")}
								aria-invalid={ageInvalid}
								name={field.name}
								value={field.value === "" ? "" : String(field.value)}
								onBlur={field.onBlur}
								onChange={(event) => {
									field.onChange(parseSelectNumber(event.target.value));
								}}
							>
								<NativeSelectOption value="">Select age</NativeSelectOption>
								{Array.from({ length: 99 - 13 + 1 }, (_, i) => i + 13).map(
									(value) => (
										<NativeSelectOption key={value} value={String(value)}>
											{value}
										</NativeSelectOption>
									),
								)}
							</NativeSelect>
							<FieldError errors={[fieldState.error]} />
						</Field>
					);
				}}
			/>
			<FieldLabel
				htmlFor="onboarding-playing-since-toggle"
				className="text-small font-medium text-text-secondary"
			>
				Playing since
			</FieldLabel>
			<button
				id="onboarding-playing-since-toggle"
				type="button"
				onClick={() => {
					setValue(
						"playing_since_less_than_one_year",
						!playingLessThanOneYear,
						{
							shouldDirty: true,
							shouldValidate: true,
						},
					);
					if (!playingLessThanOneYear) {
						setValue("playing_since_year", "", {
							shouldDirty: true,
							shouldValidate: true,
						});
					}
				}}
				className={cn(
					"mb-3 min-h-[44px] w-full rounded-lg border text-body transition-colors",
					playingLessThanOneYear
						? "border-accent bg-accent/15 text-accent"
						: "border-border bg-bg-elevated text-text-secondary",
				)}
			>
				Less than 1 year
			</button>
			<Controller
				control={control}
				name="playing_since_year"
				render={({ field, fieldState }) => {
					const playingSinceInvalid = Boolean(fieldState.error);
					return (
						<Field data-invalid={playingSinceInvalid}>
							<FieldLabel
								htmlFor="onboarding-playing-since"
								className="sr-only"
							>
								Year started
							</FieldLabel>
							<NativeSelect
								id="onboarding-playing-since"
								disabled={playingLessThanOneYear}
								className={cn(
									"w-full",
									playingLessThanOneYear && "pointer-events-none opacity-40",
									playingSinceInvalid && "aria-invalid",
								)}
								aria-invalid={playingSinceInvalid}
								name={field.name}
								value={field.value === "" ? "" : String(field.value)}
								onBlur={field.onBlur}
								onChange={(event) => {
									field.onChange(parseSelectNumber(event.target.value));
								}}
							>
								<NativeSelectOption value="">Select year</NativeSelectOption>
								{years.map((year) => (
									<NativeSelectOption key={year} value={String(year)}>
										{year}
									</NativeSelectOption>
								))}
							</NativeSelect>
							<FieldError errors={[fieldState.error]} />
						</Field>
					);
				}}
			/>
		</StepBlock>
	);
}
