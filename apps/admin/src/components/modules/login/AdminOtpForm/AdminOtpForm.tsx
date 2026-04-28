"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
	type OtpFormValues,
	otpFormSchema,
} from "@/components/modules/login/AdminOtpForm/schema";
import { Button } from "@/components/ui/button/Button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp/InputOTP";
import { resendOtp, verifyOtp } from "@/lib/auth/otp-api";

type AdminOtpFormProps = {
	email: string;
	nextPath: string;
};

export function AdminOtpForm({ email, nextPath }: AdminOtpFormProps) {
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<OtpFormValues>({
		resolver: zodResolver(otpFormSchema),
		defaultValues: {
			token: "",
		},
	});

	const verifyOtpMutation = useMutation({
		mutationFn: verifyOtp,
		onSuccess: () => {
			router.replace(nextPath);
			router.refresh();
		},
	});

	const resendOtpMutation = useMutation({
		mutationFn: resendOtp,
	});

	function handleVerifyOtp(values: OtpFormValues) {
		verifyOtpMutation.reset();
		resendOtpMutation.reset();
		const token = values.token.trim();
		verifyOtpMutation.mutate({ email, token });
	}

	function handleResendCode() {
		verifyOtpMutation.reset();
		resendOtpMutation.reset();
		resendOtpMutation.mutate(email);
	}

	const busy = verifyOtpMutation.isPending || resendOtpMutation.isPending;

	const apiError =
		(verifyOtpMutation.isError &&
			verifyOtpMutation.error instanceof Error &&
			verifyOtpMutation.error.message) ||
		(resendOtpMutation.isError &&
			resendOtpMutation.error instanceof Error &&
			resendOtpMutation.error.message) ||
		null;

	const resendSuccess =
		resendOtpMutation.isSuccess && resendOtpMutation.data?.message
			? resendOtpMutation.data.message
			: null;

	return (
		<div className="mt-8 space-y-5">
			<div className="space-y-2">
				<label
					htmlFor="admin-otp"
					className="text-label uppercase text-text-secondary"
				>
					One-time code
				</label>
				<Controller
					control={control}
					name="token"
					render={({ field }) => (
						<InputOTP
							id="admin-otp"
							name={field.name}
							maxLength={6}
							autoComplete="one-time-code"
							value={field.value}
							onChange={field.onChange}
							pattern="^[0-9]+$"
							onBlur={field.onBlur}
							disabled={busy}
							aria-invalid={!!errors.token}
						>
							<InputOTPGroup className="w-full">
								<InputOTPSlot index={0} className="h-12 flex-1 text-base" />
								<InputOTPSlot index={1} className="h-12 flex-1 text-base" />
								<InputOTPSlot index={2} className="h-12 flex-1 text-base" />
								<InputOTPSlot index={3} className="h-12 flex-1 text-base" />
								<InputOTPSlot index={4} className="h-12 flex-1 text-base" />
								<InputOTPSlot index={5} className="h-12 flex-1 text-base" />
							</InputOTPGroup>
						</InputOTP>
					)}
				/>
				{errors.token ? (
					<p className="text-small text-danger">{errors.token.message}</p>
				) : null}
			</div>

			<div className="flex gap-3">
				<Button
					type="button"
					variant="outline"
					className="min-h-12 flex-1"
					onClick={handleResendCode}
					disabled={busy}
				>
					{resendOtpMutation.isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" aria-hidden />
							<span className="sr-only">Resending code</span>
						</>
					) : (
						"Resend code"
					)}
				</Button>
				<Button
					type="button"
					variant="default"
					className="min-h-12 flex-1 shadow-accent"
					onClick={handleSubmit(handleVerifyOtp)}
					disabled={busy}
				>
					{verifyOtpMutation.isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" aria-hidden />
							<span className="sr-only">Signing in</span>
						</>
					) : (
						"Sign in"
					)}
				</Button>
			</div>

			{apiError ? <p className="text-small text-danger">{apiError}</p> : null}
			{resendSuccess ? (
				<p className="text-small text-text-secondary">{resendSuccess}</p>
			) : null}
		</div>
	);
}

AdminOtpForm.displayName = "AdminOtpForm";
