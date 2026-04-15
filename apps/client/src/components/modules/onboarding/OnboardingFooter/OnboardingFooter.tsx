"use client";

import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

type OnboardingFooterProps = {
	step: number;
	isCurrentStepValid: boolean;
	submitting: boolean;
	onBack: () => void;
	onStart: () => void;
	onNext: () => void;
	onFinish: () => void;
};

export function OnboardingFooter({
	step,
	isCurrentStepValid,
	submitting,
	onBack,
	onStart,
	onNext,
	onFinish,
}: OnboardingFooterProps) {
	return (
		<footer className="mt-auto border-t border-border bg-bg-base px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
			<div className="mx-auto flex max-w-lg gap-3">
				{step >= 2 && (
					<Button
						type="button"
						variant="outline"
						className="w-24 shrink-0"
						onClick={onBack}
					>
						Back
					</Button>
				)}
				{step === 0 && (
					<Button type="button" className="w-full" onClick={onStart}>
						Let&apos;s go
					</Button>
				)}
				{step >= 1 && step < 8 && (
					<Button
						type="button"
						className="flex-1"
						disabled={!isCurrentStepValid}
						onClick={onNext}
					>
						Next
					</Button>
				)}
				{step === 8 && (
					<Button
						type="button"
						className={cn(step >= 2 ? "flex-1" : "w-full")}
						disabled={!isCurrentStepValid || submitting}
						onClick={onFinish}
					>
						{submitting ? "Saving…" : "Finish"}
					</Button>
				)}
			</div>
		</footer>
	);
}
