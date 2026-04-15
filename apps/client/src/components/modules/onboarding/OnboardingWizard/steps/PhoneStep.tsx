"use client";

import { StepBlock } from "@/components/modules/onboarding/StepBlock/StepBlock";
import { Input } from "@/components/ui/input/Input";
import type { IsoCountry } from "@/lib/phone/country-dial";

type CountryOption = {
	iso: IsoCountry;
	label: string;
};

type PhoneStepProps = {
	phoneIso: IsoCountry;
	phoneNational: string;
	phoneError: string | null;
	countryOptions: CountryOption[];
	getDialPreview: (iso: IsoCountry) => string;
	onPhoneIsoChange: (iso: IsoCountry) => void;
	onPhoneNationalChange: (value: string) => void;
	onPhoneBlur: () => void;
};

export function PhoneStep({
	phoneIso,
	phoneNational,
	phoneError,
	countryOptions,
	getDialPreview,
	onPhoneIsoChange,
	onPhoneNationalChange,
	onPhoneBlur,
}: PhoneStepProps) {
	return (
		<StepBlock
			kicker="Step 2 of 8"
			title="Your phone number"
			subtitle="Private — used for account recovery and future notifications."
		>
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<label
						htmlFor="onboarding-phone-country"
						className="text-small font-medium text-text-secondary"
					>
						Country
					</label>
					<select
						id="onboarding-phone-country"
						value={phoneIso}
						onChange={(e) => onPhoneIsoChange(e.target.value as IsoCountry)}
						className="h-12 rounded-lg border border-border bg-bg-elevated px-3 text-small text-text-primary"
					>
						{countryOptions.map((country) => (
							<option key={country.iso} value={country.iso}>
								{country.label} ({getDialPreview(country.iso)})
							</option>
						))}
					</select>
				</div>
				<div className="flex min-w-0 flex-[2] flex-col gap-1">
					<label
						htmlFor="onboarding-phone-national"
						className="text-small font-medium text-text-secondary"
					>
						Mobile number
					</label>
					<Input
						id="onboarding-phone-national"
						value={phoneNational}
						onChange={(e) => onPhoneNationalChange(e.target.value)}
						onBlur={onPhoneBlur}
						className="h-12 w-full rounded-lg border-border bg-bg-elevated px-3 text-body text-text-primary"
						placeholder="Digits without country code"
						inputMode="tel"
						aria-invalid={Boolean(phoneError)}
					/>
				</div>
			</div>
			{phoneError && <p className="text-small text-error">{phoneError}</p>}
		</StepBlock>
	);
}
