"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { comingSoonMeta } from "@/app/constants/coming-soon";
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
			<div
				className={cn(
					"landing-glass landing-kinetic-border flex flex-col gap-1 rounded-lg p-1 shadow-card sm:flex-row sm:items-stretch",
					showError && "border-error ring-1 ring-error/30",
				)}
			>
				<input
					id="waitlist-email"
					name="email"
					type="email"
					autoComplete="email"
					required
					placeholder={comingSoonMeta.waitlistPlaceholder}
					aria-invalid={showError}
					aria-describedby={showError ? "waitlist-error" : "waitlist-helper"}
					className="h-12 min-h-12 flex-1 rounded-md border-0 bg-bg-elevated/90 px-4 text-body text-text-primary placeholder:text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex h-12 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md bg-accent px-6 text-label font-medium uppercase tracking-wide text-bg-base shadow-accent transition-colors hover:bg-accent-dim disabled:pointer-events-none disabled:opacity-50"
				>
					{isPending ? "Sending..." : comingSoonMeta.waitlistSubmit}
				</button>
			</div>
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
