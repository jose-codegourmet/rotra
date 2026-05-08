"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { signInClientAdmin, unlockClientAdminGate } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { adminClientSignInDefault, adminGateDefault } from "./default";
import {
	type AdminClientSignInValues,
	type AdminGateValues,
	adminClientSignInSchema,
	adminGateSchema,
} from "./schema";

type LoginAdminCardFormProps = {
	gateUnlockedInitially: boolean;
	onSuccess?: (redirectTo: string) => void;
	onError?: (error: unknown) => void;
};

export function LoginAdminCardForm({
	gateUnlockedInitially,
	onSuccess,
	onError,
}: LoginAdminCardFormProps) {
	const router = useRouter();
	const [step, setStep] = useState<"gate" | "credentials">(
		gateUnlockedInitially ? "credentials" : "gate",
	);
	const [showPassword, setShowPassword] = useState(false);

	const gateForm = useForm<AdminGateValues>({
		resolver: zodResolver(adminGateSchema),
		defaultValues: adminGateDefault,
	});

	const credForm = useForm<AdminClientSignInValues>({
		resolver: zodResolver(adminClientSignInSchema),
		defaultValues: adminClientSignInDefault,
	});

	const gateMutation = useMutation({
		mutationFn: async (values: AdminGateValues) =>
			unlockClientAdminGate(values.password),
		onSuccess: () => {
			toast.success("Access granted.");
			setStep("credentials");
			onSuccess?.("/login-admin");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to verify access password.",
			);
			onError?.(error);
		},
	});

	const signInMutation = useMutation({
		mutationFn: async (values: AdminClientSignInValues) =>
			signInClientAdmin({
				email: values.email.trim().toLowerCase(),
				password: values.password.trim(),
			}),
		onSuccess: (redirectTo) => {
			toast.success("Signed in successfully.");
			onSuccess?.(redirectTo);
			router.replace(redirectTo);
			router.refresh();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Unable to sign in right now.",
			);
			onError?.(error);
		},
	});

	const gateBusy = gateMutation.isPending;
	const credBusy = signInMutation.isPending;

	const onGateSubmit = gateForm.handleSubmit((values) => {
		if (gateMutation.isPending) return;
		gateMutation.mutate(values);
	});
	const onCredentialsSubmit = credForm.handleSubmit((values) => {
		if (signInMutation.isPending) return;
		signInMutation.mutate(values);
	});

	return step === "gate" ? (
		<FormProvider {...gateForm}>
			<form className="flex flex-col gap-4" onSubmit={onGateSubmit}>
				<div className="space-y-2">
					<label
						htmlFor="admin-gate-password"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Access password
					</label>
					<Controller
						control={gateForm.control}
						name="password"
						render={({ field }) => (
							<Input
								{...field}
								id="admin-gate-password"
								type="password"
								autoComplete="off"
								aria-invalid={!!gateForm.formState.errors.password}
								disabled={gateBusy}
								className="h-11 border-[#2A2A2E] bg-[#0B0B0C] text-[#F0F0F2]"
							/>
						)}
					/>
					{gateForm.formState.errors.password ? (
						<p className="text-sm text-red-400">
							{gateForm.formState.errors.password.message}
						</p>
					) : null}
				</div>
				<Button
					type="submit"
					variant="default"
					className="h-12 w-full font-bold uppercase tracking-widest"
					disabled={gateBusy}
				>
					{gateBusy ? (
						<>
							<Loader2 className="size-4 animate-spin" aria-hidden />
							<span className="sr-only">Verifying</span>
						</>
					) : (
						"Continue"
					)}
				</Button>
			</form>
		</FormProvider>
	) : (
		<FormProvider {...credForm}>
			<form className="flex flex-col gap-4" onSubmit={onCredentialsSubmit}>
				<div className="space-y-2">
					<label
						htmlFor="admin-client-email"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Email
					</label>
					<Controller
						control={credForm.control}
						name="email"
						render={({ field }) => (
							<Input
								{...field}
								id="admin-client-email"
								type="email"
								autoComplete="email"
								aria-invalid={!!credForm.formState.errors.email}
								disabled={credBusy}
								className="h-11 border-[#2A2A2E] bg-[#0B0B0C] text-[#F0F0F2]"
							/>
						)}
					/>
					{credForm.formState.errors.email ? (
						<p className="text-sm text-red-400">
							{credForm.formState.errors.email.message}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="admin-client-password"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Password
					</label>
					<Controller
						control={credForm.control}
						name="password"
						render={({ field }) => (
							<div className="relative">
								<Input
									{...field}
									id="admin-client-password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									aria-invalid={!!credForm.formState.errors.password}
									disabled={credBusy}
									className={cn(
										"h-11 border-[#2A2A2E] bg-[#0B0B0C] pr-11 text-[#F0F0F2]",
									)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#9090A0] transition-colors hover:text-[#F0F0F2]"
									onClick={() => setShowPassword((c) => !c)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									disabled={credBusy}
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
					{credForm.formState.errors.password ? (
						<p className="text-sm text-red-400">
							{credForm.formState.errors.password.message}
						</p>
					) : null}
				</div>
				<Button
					type="submit"
					variant="default"
					className="h-12 w-full font-bold uppercase tracking-widest"
					disabled={credBusy}
				>
					{credBusy ? (
						<>
							<Loader2 className="size-4 animate-spin" aria-hidden />
							<span className="sr-only">Signing in</span>
						</>
					) : (
						"Sign in"
					)}
				</Button>
			</form>
		</FormProvider>
	);
}
