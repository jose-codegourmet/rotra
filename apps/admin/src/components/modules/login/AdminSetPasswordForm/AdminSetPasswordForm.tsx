"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { SetPasswordFormValues } from "@/components/modules/login/AdminSetPasswordForm/schema";
import { setPasswordFormSchema } from "@/components/modules/login/AdminSetPasswordForm/schema";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { setPassword } from "@/lib/auth/password-api";

export function AdminSetPasswordForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SetPasswordFormValues>({
		resolver: zodResolver(setPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const setPasswordMutation = useMutation({
		mutationFn: setPassword,
		onSuccess: () => {
			router.replace("/dashboard");
			router.refresh();
		},
	});

	function onSubmit(values: SetPasswordFormValues) {
		setPasswordMutation.reset();
		setPasswordMutation.mutate(values.password);
	}

	const apiError =
		setPasswordMutation.isError && setPasswordMutation.error instanceof Error
			? setPasswordMutation.error.message
			: null;

	const busy = setPasswordMutation.isPending;

	return (
		<div className="mt-8 space-y-5">
			<div className="space-y-2">
				<label
					htmlFor="admin-password"
					className="text-label uppercase text-text-secondary"
				>
					New password
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
								autoComplete="new-password"
								placeholder="At least 8 characters"
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

			<div className="space-y-2">
				<label
					htmlFor="admin-password-confirm"
					className="text-label uppercase text-text-secondary"
				>
					Confirm password
				</label>
				<Controller
					control={control}
					name="confirmPassword"
					render={({ field }) => (
						<div className="relative">
							<Input
								{...field}
								id="admin-password-confirm"
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
								placeholder="Re-enter your password"
								aria-invalid={!!errors.confirmPassword}
								disabled={busy}
								className="pr-11"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-disabled transition-colors hover:text-text-primary"
								onClick={() => setShowConfirmPassword((current) => !current)}
								aria-label={
									showConfirmPassword ? "Hide password" : "Show password"
								}
								disabled={busy}
							>
								{showConfirmPassword ? (
									<EyeOff className="size-4" aria-hidden />
								) : (
									<Eye className="size-4" aria-hidden />
								)}
							</button>
						</div>
					)}
				/>
				{errors.confirmPassword ? (
					<p className="text-small text-danger">
						{errors.confirmPassword.message}
					</p>
				) : null}
			</div>

			<Button
				type="button"
				variant="default"
				className="min-h-12 w-full shadow-accent"
				onClick={handleSubmit(onSubmit)}
				disabled={busy}
			>
				{busy ? (
					<>
						<Loader2 className="size-4 animate-spin" aria-hidden />
						<span className="sr-only">Setting password</span>
					</>
				) : (
					"Set password"
				)}
			</Button>

			{apiError ? <p className="text-small text-danger">{apiError}</p> : null}
		</div>
	);
}

AdminSetPasswordForm.displayName = "AdminSetPasswordForm";
