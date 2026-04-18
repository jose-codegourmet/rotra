"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { comingSoonMeta } from "@/app/constants/coming-soon";
import { Button } from "@/components/ui/button/Button";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/ui/input-group/InputGroup";
import { cn } from "@/lib/utils";
import {
	submitWaitlistEmail,
	type WaitlistResult,
} from "@/server/actions/waitlist";

type WaitlistFormProps = {
	action?: WaitlistFormAction;
};

export type WaitlistFormAction = (
	prev: WaitlistResult | undefined,
	formData: FormData,
) => Promise<WaitlistResult>;

export function WaitlistForm({
	action = submitWaitlistEmail,
}: WaitlistFormProps) {
	const lastOk = useRef(false);
	const [state, formAction, isPending] = useActionState<
		WaitlistResult | undefined,
		FormData
	>(action, undefined);

	useEffect(() => {
		if (state?.ok === true && !lastOk.current) {
			lastOk.current = true;
			toast.success("You're in.");
		}
		if (state?.ok === false) {
			lastOk.current = false;
		}
	}, [state]);

	const showError = state?.ok === false;

	return (
		<form action={formAction} className="w-full max-w-[480px] space-y-2">
			<InputGroup
				className={cn(
					"landing-glass landing-kinetic-border h-auto min-h-0 flex-col overflow-hidden rounded-lg p-0 shadow-card sm:h-12 sm:min-h-12 sm:flex-row sm:items-stretch",
					showError && "border-error ring-1 ring-error/30",
				)}
			>
				<InputGroupInput
					id="waitlist-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					placeholder={comingSoonMeta.waitlistPlaceholder}
					aria-invalid={showError}
					aria-describedby={showError ? "waitlist-error" : "waitlist-helper"}
					className={cn(
						"h-12 min-h-12 flex-1 rounded-none rounded-t-lg border-0 px-4 text-body text-text-primary placeholder:text-text-secondary sm:rounded-l-lg sm:rounded-tr-none",
						"!bg-bg-elevated/90 dark:!bg-bg-elevated/90",
						"focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
					)}
				/>
				<Button
					type="submit"
					disabled={isPending}
					className="h-12 min-h-[44px] w-full min-w-[44px] shrink-0 rounded-none rounded-b-lg px-6 text-label uppercase tracking-wide shadow-accent sm:w-auto sm:rounded-r-lg sm:rounded-b-none"
				>
					{isPending ? "Sending..." : comingSoonMeta.waitlistSubmit}
				</Button>
			</InputGroup>
			{showError ? (
				<p id="waitlist-error" className="text-small text-error" role="alert">
					{state.error}
				</p>
			) : (
				<p id="waitlist-helper" className="text-small text-text-secondary">
					{comingSoonMeta.waitlistHelper}
				</p>
			)}
		</form>
	);
}
