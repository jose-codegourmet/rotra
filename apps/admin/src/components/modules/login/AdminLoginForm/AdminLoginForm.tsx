"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { LoginFormValues } from "@/components/modules/login/AdminLoginForm/schema";
import { loginFormSchema } from "@/components/modules/login/AdminLoginForm/schema";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { requestOtp } from "@/lib/auth/otp-api";

type AdminLoginFormProps = {
	nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const requestOtpMutation = useMutation({
		mutationFn: requestOtp,
		onSuccess: (_data, email) => {
			const nextParam = encodeURIComponent(nextPath);
			const emailParam = encodeURIComponent(email);
			router.push(`/login/otp?email=${emailParam}&next=${nextParam}`);
		},
	});

	function handleSendOtp(values: LoginFormValues) {
		requestOtpMutation.reset();
		const email = values.email.trim().toLowerCase();
		requestOtpMutation.mutate(email);
	}

	const apiError =
		requestOtpMutation.isError && requestOtpMutation.error instanceof Error
			? requestOtpMutation.error.message
			: null;

	return (
		<div className="mt-8 space-y-5">
			<div className="space-y-2">
				<label
					htmlFor="admin-email"
					className="text-label uppercase text-text-secondary"
				>
					Email
				</label>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<Input
							{...field}
							id="admin-email"
							type="email"
							autoComplete="email"
							placeholder="you@organization.com"
							aria-invalid={!!errors.email}
							disabled={requestOtpMutation.isPending}
						/>
					)}
				/>
				{errors.email ? (
					<p className="text-small text-danger">{errors.email.message}</p>
				) : null}
			</div>

			<Button
				type="button"
				variant="default"
				className="min-h-12 w-full shadow-accent"
				onClick={handleSubmit(handleSendOtp)}
				disabled={requestOtpMutation.isPending}
			>
				{requestOtpMutation.isPending ? (
					<>
						<Loader2 className="size-4 animate-spin" aria-hidden />
						<span className="sr-only">Sending one-time code</span>
					</>
				) : (
					"Continue"
				)}
			</Button>

			{apiError ? <p className="text-small text-danger">{apiError}</p> : null}
		</div>
	);
}

AdminLoginForm.displayName = "AdminLoginForm";
