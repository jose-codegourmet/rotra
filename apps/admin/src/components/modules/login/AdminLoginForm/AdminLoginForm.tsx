"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { LoginFormValues } from "@/components/modules/login/AdminLoginForm/schema";
import { loginFormSchema } from "@/components/modules/login/AdminLoginForm/schema";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import type { PasswordApiResponse } from "@/lib/auth/password-api";
import { requestPasswordReset, signIn } from "@/lib/auth/password-api";

type AdminLoginFormProps = {
	nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const {
		control,
		handleSubmit,
		getValues,
		trigger,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signInMutation = useMutation<
		PasswordApiResponse,
		Error,
		LoginFormValues
	>({
		mutationFn: (values: LoginFormValues) =>
			signIn({
				email: values.email.trim().toLowerCase(),
				password: values.password.trim(),
			}),
		onSuccess: () => {
			router.replace(nextPath);
			router.refresh();
		},
	});

	const resetPasswordMutation = useMutation<PasswordApiResponse, Error, string>(
		{
			mutationFn: requestPasswordReset,
		},
	);

	function handleSignIn(values: LoginFormValues) {
		signInMutation.reset();
		resetPasswordMutation.reset();
		signInMutation.mutate(values);
	}

	async function handleResetPassword() {
		signInMutation.reset();
		resetPasswordMutation.reset();
		const validEmail = await trigger("email");
		if (!validEmail) {
			return;
		}
		const email = getValues("email").trim().toLowerCase();
		resetPasswordMutation.mutate(email);
	}

	const apiError =
		signInMutation.isError && signInMutation.error instanceof Error
			? signInMutation.error.message
			: null;
	const resetError =
		resetPasswordMutation.isError &&
		resetPasswordMutation.error instanceof Error
			? resetPasswordMutation.error.message
			: null;
	const resetSuccess =
		resetPasswordMutation.isSuccess && resetPasswordMutation.data?.message
			? resetPasswordMutation.data.message
			: null;

	const busy = signInMutation.isPending || resetPasswordMutation.isPending;

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
							disabled={busy}
						/>
					)}
				/>
				{errors.email ? (
					<p className="text-small text-danger">{errors.email.message}</p>
				) : null}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="admin-password"
					className="text-label uppercase text-text-secondary"
				>
					Password
				</label>
				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<div className="relative">
							<Input
								{...field}
								id="admin-password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="Your password"
								aria-invalid={!!errors.password}
								disabled={busy}
								className="pr-11"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-disabled transition-colors hover:text-text-primary"
								onClick={() => setShowPassword((current) => !current)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								disabled={busy}
							>
								{showPassword ? (
									<EyeOff className="size-4" aria-hidden />
								) : (
									<Eye className="size-4" aria-hidden />
								)}
							</button>
						</div>
					)}
				/>
				{errors.password ? (
					<p className="text-small text-danger">{errors.password.message}</p>
				) : null}
			</div>

			<Button
				type="button"
				variant="default"
				className="min-h-12 w-full shadow-accent"
				onClick={handleSubmit(handleSignIn)}
				disabled={busy}
			>
				{busy ? (
					<>
						<Loader2 className="size-4 animate-spin" aria-hidden />
						<span className="sr-only">Signing in</span>
					</>
				) : (
					"Sign in"
				)}
			</Button>

			<Button
				type="button"
				variant="ghost"
				className="min-h-10 w-full text-small text-text-secondary hover:text-text-primary"
				onClick={handleResetPassword}
				disabled={busy}
			>
				{resetPasswordMutation.isPending
					? "Sending reset link..."
					: "Forgot password? Send reset link"}
			</Button>

			{apiError ? <p className="text-small text-danger">{apiError}</p> : null}
			{resetError ? (
				<p className="text-small text-danger">{resetError}</p>
			) : null}
			{resetSuccess ? (
				<p className="text-small text-text-secondary">{resetSuccess}</p>
			) : null}
		</div>
	);
}

AdminLoginForm.displayName = "AdminLoginForm";
