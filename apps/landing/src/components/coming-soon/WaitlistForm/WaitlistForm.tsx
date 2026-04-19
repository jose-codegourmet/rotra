"use client";

import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { comingSoonMeta } from "@/app/constants/coming-soon";
import { Button } from "@/components/ui/button/Button";
import {
	InputGroup,
	InputGroupInput,
} from "@/components/ui/input-group/InputGroup";
import { cn } from "@/lib/utils";
import {
	isValidWaitlistEmail,
	normalizeWaitlistEmail,
} from "@/lib/waitlist/validate-email";

export type WaitlistSubmitFn = (
	email: string,
) => Promise<{ ok: true } | { ok: false; error: string }>;

async function defaultSubmitWaitlist(
	email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
	const res = await fetch("/api/waitlist", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email }),
	});
	let data: unknown;
	try {
		data = await res.json();
	} catch {
		return { ok: false, error: "Something went wrong. Please try again." };
	}
	const err =
		data &&
		typeof data === "object" &&
		"error" in data &&
		typeof (data as { error: unknown }).error === "string"
			? (data as { error: string }).error
			: null;
	if (!res.ok) {
		return {
			ok: false,
			error: err ?? "Something went wrong. Please try again.",
		};
	}
	return { ok: true };
}

type WaitlistFormValues = {
	email: string;
};

export type WaitlistFormProps = {
	/** Storybook / tests — override the default POST /api/waitlist behavior */
	submitWaitlist?: WaitlistSubmitFn;
};

export function WaitlistForm({ submitWaitlist }: WaitlistFormProps) {
	const submitFn = submitWaitlist ?? defaultSubmitWaitlist;

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<WaitlistFormValues>({
		defaultValues: { email: "" },
		mode: "onSubmit",
	});

	const mutation = useMutation({
		mutationFn: async (email: string) => {
			const normalized = normalizeWaitlistEmail(email);
			const result = await submitFn(normalized);
			if (!result.ok) {
				throw new Error(result.error);
			}
		},
	});

	const onValid = (values: WaitlistFormValues) => {
		mutation.mutate(values.email);
	};

	const showError = Boolean(errors.email) || Boolean(mutation.error);
	const errorMessage =
		errors.email?.message ??
		(mutation.error instanceof Error ? mutation.error.message : undefined);

	if (mutation.isSuccess) {
		return (
			<div
				className="w-full max-w-[480px] rounded-lg border border-border bg-bg-elevated/90 px-4 py-5 text-center shadow-card dark:bg-bg-elevated/90"
				role="status"
			>
				<p className="text-body text-text-primary">
					{comingSoonMeta.waitlistThankYou}
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onValid)}
			className="w-full max-w-[480px] space-y-2"
			noValidate
		>
			<InputGroup
				className={cn(
					"landing-glass landing-kinetic-border h-auto min-h-0 flex-col overflow-hidden rounded-lg p-0 shadow-card sm:h-12 sm:min-h-12 sm:flex-row sm:items-stretch",
					showError && "border-error ring-1 ring-error/30",
				)}
			>
				<Controller
					name="email"
					control={control}
					rules={{
						validate: (value) =>
							isValidWaitlistEmail(value) ? true : "Check your email address.",
					}}
					render={({ field }) => (
						<InputGroupInput
							{...field}
							id="waitlist-email"
							type="email"
							autoComplete="email"
							placeholder={comingSoonMeta.waitlistPlaceholder}
							aria-invalid={showError}
							aria-describedby={
								showError ? "waitlist-error" : "waitlist-helper"
							}
							onChange={(e) => {
								field.onChange(e);
								mutation.reset();
							}}
							className={cn(
								"h-12 min-h-12 flex-1 rounded-none rounded-t-lg border-0 px-4 text-body text-text-primary placeholder:text-text-secondary sm:rounded-l-lg sm:rounded-tr-none",
								"!bg-bg-elevated/90 dark:!bg-bg-elevated/90",
								"focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
							)}
						/>
					)}
				/>
				<Button
					type="submit"
					disabled={mutation.isPending}
					className="h-12 min-h-[44px] w-full min-w-[44px] shrink-0 rounded-none rounded-b-lg px-6 text-label uppercase tracking-wide shadow-accent sm:w-auto sm:rounded-r-lg sm:rounded-b-none"
				>
					{mutation.isPending ? "Sending..." : comingSoonMeta.waitlistSubmit}
				</Button>
			</InputGroup>
			{showError && errorMessage ? (
				<p id="waitlist-error" className="text-small text-error" role="alert">
					{errorMessage}
				</p>
			) : (
				<p id="waitlist-helper" className="text-small text-text-secondary">
					{comingSoonMeta.waitlistHelper}
				</p>
			)}
		</form>
	);
}
