"use client";

import { Controller, useFormContext } from "react-hook-form";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { Field, FieldError, FieldLabel } from "@/components/ui/field/Field";
import { Input } from "@/components/ui/input/Input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select/NativeSelect";
import type { OnboardingFormValues } from "@/lib/onboarding/onboarding-form-schema";
import type { IsoCountry } from "@/lib/phone/country-dial";

type CountryOption = {
	iso: IsoCountry;
	label: string;
};

type PhoneStepProps = {
	countryOptions: CountryOption[];
	getDialPreview: (iso: IsoCountry) => string;
};

export function PhoneStep({ countryOptions, getDialPreview }: PhoneStepProps) {
	const { control } = useFormContext<OnboardingFormValues>();

	return (
		<StepBlock
			kicker="Step 2 of 8"
			title="Your phone number"
			subtitle="Private — used for account recovery and future notifications."
		>
			<div className="flex flex-col gap-3 sm:flex-row">
				<Field className="min-w-0 flex-1">
					<FieldLabel htmlFor="onboarding-phone-country">Country</FieldLabel>
					<Controller
						control={control}
						name="phoneIso"
						render={({ field }) => (
							<NativeSelect
								id="onboarding-phone-country"
								className="w-full min-w-0"
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
							>
								{countryOptions.map((country) => (
									<NativeSelectOption key={country.iso} value={country.iso}>
										{country.label} ({getDialPreview(country.iso)})
									</NativeSelectOption>
								))}
							</NativeSelect>
						)}
					/>
				</Field>
				<Controller
					control={control}
					name="phoneNational"
					render={({ field, fieldState }) => {
						const nationalInvalid = Boolean(fieldState.error);
						return (
							<Field
								className="min-w-0 flex-[2]"
								data-invalid={nationalInvalid}
							>
								<FieldLabel htmlFor="onboarding-phone-national">
									Mobile number
								</FieldLabel>
								<Input
									id="onboarding-phone-national"
									className="h-12 w-full rounded-lg border-border bg-bg-elevated px-3 text-body text-text-primary"
									placeholder="Digits without country code"
									inputMode="tel"
									aria-invalid={nationalInvalid}
									{...field}
								/>
								<FieldError errors={[fieldState.error]} />
							</Field>
						);
					}}
				/>
			</div>
		</StepBlock>
	);
}
