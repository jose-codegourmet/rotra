"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { OnboardingFooter } from "@/components/modules/onboarding/OnboardingFooter/OnboardingFooter";
import { ProgressDots } from "@/components/modules/onboarding/ProgressDots/ProgressDots";
import type { OnboardingPayload } from "@/lib/onboarding/validate-payload";
import { validateOnboardingPayload } from "@/lib/onboarding/validate-payload";
import {
	COUNTRY_LABELS,
	dialDigitsFor,
	type IsoCountry,
	splitE164,
	toE164,
} from "@/lib/phone/country-dial";

import type { OnboardingWizardProps } from "./OnboardingWizard.types";
import { ChoiceStep } from "./steps/ChoiceStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { LevelStep } from "./steps/LevelStep";
import { NameStep } from "./steps/NameStep";
import { PhoneStep } from "./steps/PhoneStep";
import { WelcomeStep } from "./steps/WelcomeStep";

const HISTORY_KEY = "rotraOnboardingStep";

const COUNTRY_OPTIONS: { iso: IsoCountry; label: string }[] = (
	Object.keys(COUNTRY_LABELS) as IsoCountry[]
).map((iso) => ({ iso, label: COUNTRY_LABELS[iso] }));

const FORMAT_OPTIONS = [
	{ v: "singles" as const, label: "Singles" },
	{ v: "doubles" as const, label: "Doubles" },
	{ v: "both" as const, label: "Both" },
];

const COURT_POSITION_OPTIONS = [
	{ v: "front" as const, label: "Front player" },
	{ v: "back" as const, label: "Back player" },
	{ v: "both" as const, label: "All-around" },
];

const PLAY_MODE_OPTIONS = [
	{ v: "competitive" as const, label: "Competitive" },
	{ v: "social" as const, label: "Social (fun games)" },
	{ v: "both" as const, label: "Mix of both" },
];

const TOURNAMENT_WIN_OPTIONS = [
	{ v: "none" as const, label: "No wins this year" },
	{ v: "1_to_3" as const, label: "1–3 tournament wins" },
	{ v: "4_plus" as const, label: "4+ tournament wins" },
];

function guessCountryCode(): IsoCountry {
	if (typeof navigator === "undefined") return "PH";
	const region = navigator.language?.split("-")[1]?.toUpperCase();
	if (!region) return "PH";
	const match = COUNTRY_OPTIONS.find((country) => country.iso === region);
	return match?.iso ?? "PH";
}

function dialPreview(iso: IsoCountry): string {
	const digits = dialDigitsFor(iso);
	return digits ? `+${digits}` : "+";
}

export function OnboardingWizard({
	welcomeKind,
	displayName,
	initialName,
	initialPhoneE164,
}: OnboardingWizardProps) {
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [name, setName] = useState(initialName);
	const [nameTouched, setNameTouched] = useState(false);
	const [phoneIso, setPhoneIso] = useState<IsoCountry>("PH");
	const [phoneNational, setPhoneNational] = useState("");
	const [phoneTouched, setPhoneTouched] = useState(false);
	const [age, setAge] = useState<number | "">("");
	const [playingLessThanOneYear, setPlayingLessThanOneYear] = useState(false);
	const [playingSinceYear, setPlayingSinceYear] = useState<number | "">("");
	const [playingTouched, setPlayingTouched] = useState(false);
	const [playingLevel, setPlayingLevel] = useState<
		OnboardingPayload["playing_level"] | ""
	>("");
	const [formatPreference, setFormatPreference] = useState<
		OnboardingPayload["format_preference"] | ""
	>("");
	const [courtPosition, setCourtPosition] = useState<
		OnboardingPayload["court_position"] | ""
	>("");
	const [playMode, setPlayMode] = useState<OnboardingPayload["play_mode"] | "">(
		"",
	);
	const [tournamentWins, setTournamentWins] = useState<
		OnboardingPayload["tournament_wins_last_year"] | ""
	>("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (initialPhoneE164) return;
		setPhoneIso(guessCountryCode());
	}, [initialPhoneE164]);

	useEffect(() => {
		if (!initialPhoneE164) return;
		const parsed = splitE164(initialPhoneE164);
		if (parsed) {
			setPhoneIso(parsed.iso);
			setPhoneNational(parsed.nationalDigits);
		}
	}, [initialPhoneE164]);

	useEffect(() => {
		window.history.replaceState({ [HISTORY_KEY]: 0 }, "", window.location.href);
		const onPop = (event: PopStateEvent) => {
			const stateStep = event.state?.[HISTORY_KEY];
			if (typeof stateStep === "number" && stateStep >= 0 && stateStep <= 8) {
				setStep(stateStep);
				return;
			}
			setStep((currentStep) => Math.max(0, currentStep - 1));
		};

		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
	}, []);

	const pushStep = useCallback((nextStep: number) => {
		window.history.pushState(
			{ [HISTORY_KEY]: nextStep },
			"",
			window.location.href,
		);
		setStep(nextStep);
	}, []);

	const nameError = useMemo(() => {
		if (!nameTouched && name.length === 0) return null;
		if (name.trim().length < 2) return "Name must be at least 2 characters.";
		if (!/^[\p{L}\s'-]{2,40}$/u.test(name.trim()))
			return "Name contains invalid characters.";
		return null;
	}, [name, nameTouched]);

	const phoneE164 = useMemo(
		() => toE164(phoneIso, phoneNational) ?? "",
		[phoneNational, phoneIso],
	);

	const phoneError = useMemo(() => {
		if (!phoneTouched && !phoneNational) return null;
		if (!toE164(phoneIso, phoneNational))
			return "Please enter a valid phone number.";
		return null;
	}, [phoneNational, phoneIso, phoneTouched]);

	const playingError = useMemo(() => {
		if (!playingTouched) return null;
		if (age === "") return "Please select your age.";
		if (!playingLessThanOneYear && playingSinceYear === "") {
			return "Please tell us when you started playing.";
		}
		return null;
	}, [age, playingLessThanOneYear, playingSinceYear, playingTouched]);

	const currentYear = new Date().getFullYear();
	const years = useMemo(
		() =>
			Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i),
		[currentYear],
	);

	const stepValid = (currentStep: number): boolean => {
		switch (currentStep) {
			case 0:
				return true;
			case 1: {
				const trimmedName = name.trim();
				return (
					trimmedName.length >= 2 &&
					trimmedName.length <= 40 &&
					/^[\p{L}\s'-]{2,40}$/u.test(trimmedName)
				);
			}
			case 2:
				return Boolean(toE164(phoneIso, phoneNational));
			case 3:
				return (
					age !== "" &&
					(playingLessThanOneYear ||
						(playingSinceYear !== "" && playingSinceYear >= 1960))
				);
			case 4:
				return playingLevel !== "";
			case 5:
				return formatPreference !== "";
			case 6:
				return courtPosition !== "";
			case 7:
				return playMode !== "";
			case 8:
				return tournamentWins !== "";
			default:
				return false;
		}
	};

	const welcomeCopy = useMemo(() => {
		if (welcomeKind === "return_has_phone") {
			return {
				heading: `Hey ${displayName}, still here!`,
				subtitle: "Just a few more questions and you're ready to play.",
			};
		}
		if (welcomeKind === "return_no_phone") {
			return {
				heading: `Welcome back, ${displayName}!`,
				subtitle:
					"You still need to finish your profile. It only takes a minute.",
			};
		}
		return {
			heading: `You're almost in, ${displayName}!`,
			subtitle: "Set up your profile in under 2 minutes and start playing.",
		};
	}, [welcomeKind, displayName]);

	const buildPayload = (): OnboardingPayload => ({
		name: name.trim(),
		phone: phoneE164,
		age: Number(age),
		playing_since: playingLessThanOneYear
			? null
			: playingSinceYear === ""
				? null
				: Number(playingSinceYear),
		playing_since_less_than_one_year: playingLessThanOneYear,
		playing_level: playingLevel as OnboardingPayload["playing_level"],
		format_preference:
			formatPreference as OnboardingPayload["format_preference"],
		court_position: courtPosition as OnboardingPayload["court_position"],
		play_mode: playMode as OnboardingPayload["play_mode"],
		tournament_wins_last_year:
			tournamentWins as OnboardingPayload["tournament_wins_last_year"],
	});

	const tryAdvance = () => {
		if (step === 1) setNameTouched(true);
		if (step === 2) setPhoneTouched(true);
		if (step === 3) setPlayingTouched(true);
		if (!stepValid(step)) return;
		if (step < 8) pushStep(step + 1);
	};

	const finish = async () => {
		setPlayingTouched(true);
		if (!stepValid(8)) return;
		const payload = buildPayload();
		const validationResult = validateOnboardingPayload(payload);
		if (!validationResult.ok) {
			toast.error(validationResult.message);
			return;
		}

		setSubmitting(true);
		try {
			const response = await fetch("/api/onboarding/complete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validationResult.data),
			});
			if (!response.ok) {
				const err = (await response.json().catch(() => null)) as {
					error?: string;
				} | null;
				toast.error(err?.error ?? "Something went wrong. Please try again.");
				return;
			}
			router.push("/home");
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	const goBackUi = () => {
		if (step <= 1) return;
		window.history.back();
	};

	return (
		<div className="flex flex-1 flex-col">
			<ProgressDots currentStep={step} />

			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 md:px-8">
				<div className="flex flex-1 flex-col justify-center gap-6">
					{step === 0 && (
						<WelcomeStep
							heading={welcomeCopy.heading}
							subtitle={welcomeCopy.subtitle}
						/>
					)}
					{step === 1 && (
						<NameStep
							name={name}
							onNameChange={setName}
							onNameBlur={() => setNameTouched(true)}
							nameError={nameError}
						/>
					)}
					{step === 2 && (
						<PhoneStep
							phoneIso={phoneIso}
							phoneNational={phoneNational}
							phoneError={phoneError}
							countryOptions={COUNTRY_OPTIONS}
							getDialPreview={dialPreview}
							onPhoneIsoChange={setPhoneIso}
							onPhoneNationalChange={setPhoneNational}
							onPhoneBlur={() => setPhoneTouched(true)}
						/>
					)}
					{step === 3 && (
						<ExperienceStep
							age={age}
							playingLessThanOneYear={playingLessThanOneYear}
							playingSinceYear={playingSinceYear}
							playingError={playingError}
							years={years}
							onAgeChange={setAge}
							onToggleLessThanOneYear={() => {
								setPlayingLessThanOneYear((value) => !value);
								if (!playingLessThanOneYear) setPlayingSinceYear("");
							}}
							onPlayingSinceYearChange={(value) => {
								setPlayingSinceYear(value);
								if (value !== "") setPlayingLessThanOneYear(false);
							}}
						/>
					)}
					{step === 4 && (
						<LevelStep
							playingLevel={playingLevel}
							onPlayingLevelChange={setPlayingLevel}
						/>
					)}
					{step === 5 && (
						<ChoiceStep
							kicker="Step 5 of 8"
							title="How you play"
							subtitle="Singles, doubles, or both."
							value={formatPreference}
							options={FORMAT_OPTIONS}
							onChange={setFormatPreference}
						/>
					)}
					{step === 6 && (
						<ChoiceStep
							kicker="Step 6 of 8"
							title="Your court position"
							subtitle="Helps Que Masters balance doubles teams."
							value={courtPosition}
							options={COURT_POSITION_OPTIONS}
							onChange={setCourtPosition}
						/>
					)}
					{step === 7 && (
						<ChoiceStep
							kicker="Step 7 of 8"
							title="Your play style"
							subtitle="Competitive, social, or a mix."
							value={playMode}
							options={PLAY_MODE_OPTIONS}
							onChange={setPlayMode}
						/>
					)}
					{step === 8 && (
						<ChoiceStep
							kicker="Step 8 of 8"
							title="Your track record"
							subtitle="Tournament wins in the last 12 months (self-reported)."
							value={tournamentWins}
							options={TOURNAMENT_WIN_OPTIONS}
							onChange={setTournamentWins}
							helperText="You can update this anytime from profile settings."
						/>
					)}
				</div>
			</div>

			<OnboardingFooter
				step={step}
				isCurrentStepValid={stepValid(step)}
				submitting={submitting}
				onBack={goBackUi}
				onStart={() => pushStep(1)}
				onNext={tryAdvance}
				onFinish={finish}
			/>
		</div>
	);
}
