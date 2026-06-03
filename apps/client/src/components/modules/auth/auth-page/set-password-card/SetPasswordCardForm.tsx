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
import { cn } from "@/lib/utils";

import { setPasswordDefault } from "./default";
import { type SetPasswordValues, setPasswordSchema } from "./schema";

async function submitSetPassword(password: string): Promise<void> {
	const res = await fetch("/api/auth/set-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password }),
	});
	const payload = (await res.json().catch(() => null)) as {
		error?: string;
		ok?: boolean;
	} | null;

	if (!res.ok) {
		throw new Error(payload?.error ?? "Unable to set password right now.");
	}
}

export function SetPasswordCardForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const form = useForm<SetPasswordValues>({
		resolver: zodResolver(setPasswordSchema),
		defaultValues: setPasswordDefault,
	});

	const mutation = useMutation({
		mutationFn: (values: SetPasswordValues) =>
			submitSetPassword(values.password),
		onSuccess: () => {
			toast.success("Password saved. You can sign in with it next time.");
			router.replace("/home");
			router.refresh();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to set password right now.",
			);
		},
	});

	const busy = mutation.isPending;
	const onSubmit = form.handleSubmit((values) => {
		if (busy) return;
		mutation.mutate(values);
	});

	return (
		<FormProvider {...form}>
			<form className="flex flex-col gap-4" onSubmit={onSubmit}>
				<div className="space-y-2">
					<label
						htmlFor="set-password"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Password
					</label>
					<Controller
						control={form.control}
						name="password"
						render={({ field }) => (
							<div className="relative">
								<Input
									{...field}
									id="set-password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									disabled={busy}
									className={cn(
										"h-11 border-[#2A2A2E] bg-[#0B0B0C] pr-11 text-[#F0F0F2]",
									)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#9090A0] transition-colors hover:text-[#F0F0F2]"
									onClick={() => setShowPassword((c) => !c)}
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
					{form.formState.errors.password ? (
						<p className="text-sm text-red-400">
							{form.formState.errors.password.message}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="set-password-confirm"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Confirm password
					</label>
					<Controller
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<div className="relative">
								<Input
									{...field}
									id="set-password-confirm"
									type={showConfirm ? "text" : "password"}
									autoComplete="new-password"
									disabled={busy}
									className={cn(
										"h-11 border-[#2A2A2E] bg-[#0B0B0C] pr-11 text-[#F0F0F2]",
									)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#9090A0] transition-colors hover:text-[#F0F0F2]"
									onClick={() => setShowConfirm((c) => !c)}
									aria-label={
										showConfirm
											? "Hide confirm password"
											: "Show confirm password"
									}
									disabled={busy}
								>
									{showConfirm ? (
										<EyeOff className="size-4" aria-hidden />
									) : (
										<Eye className="size-4" aria-hidden />
									)}
								</button>
							</div>
						)}
					/>
					{form.formState.errors.confirmPassword ? (
						<p className="text-sm text-red-400">
							{form.formState.errors.confirmPassword.message}
						</p>
					) : null}
				</div>
				<Button
					type="submit"
					variant="default"
					className="h-12 w-full font-bold uppercase tracking-widest"
					disabled={busy}
				>
					{busy ? (
						<>
							<Loader2 className="size-4 animate-spin" aria-hidden />
							<span className="sr-only">Saving password</span>
						</>
					) : (
						"Save password"
					)}
				</Button>
			</form>
		</FormProvider>
	);
}
