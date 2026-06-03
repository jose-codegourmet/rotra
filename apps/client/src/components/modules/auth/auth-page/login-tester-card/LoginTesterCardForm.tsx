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

import { loginTesterDefault } from "./default";
import { type LoginTesterValues, loginTesterSchema } from "./schema";

async function signInTester(input: {
	email: string;
	testerPassword: string;
}): Promise<void> {
	const res = await fetch("/api/auth/tester-sign-in", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	const payload = (await res.json().catch(() => null)) as {
		error?: string;
		code?: string;
		ok?: boolean;
	} | null;

	if (!res.ok) {
		if (payload?.code === "NOT_TESTER") {
			throw new Error("This account is not authorized for tester access.");
		}
		throw new Error(payload?.error ?? "Incorrect email or password.");
	}
}

export function LoginTesterCardForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<LoginTesterValues>({
		resolver: zodResolver(loginTesterSchema),
		defaultValues: loginTesterDefault,
	});

	const mutation = useMutation({
		mutationFn: (values: LoginTesterValues) =>
			signInTester({
				email: values.email.trim().toLowerCase(),
				testerPassword: values.testerPassword,
			}),
		onSuccess: () => {
			toast.success("Signed in successfully.");
			router.replace("/home");
			router.refresh();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Unable to sign in right now.",
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
						htmlFor="tester-email"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Email
					</label>
					<Controller
						control={form.control}
						name="email"
						render={({ field }) => (
							<Input
								{...field}
								id="tester-email"
								type="email"
								autoComplete="email"
								disabled={busy}
								className="h-11 border-[#2A2A2E] bg-[#0B0B0C] text-[#F0F0F2]"
							/>
						)}
					/>
					{form.formState.errors.email ? (
						<p className="text-sm text-red-400">
							{form.formState.errors.email.message}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label
						htmlFor="tester-password"
						className="text-xs font-bold uppercase tracking-wider"
						style={{ color: "#9090A0" }}
					>
						Tester password
					</label>
					<Controller
						control={form.control}
						name="testerPassword"
						render={({ field }) => (
							<div className="relative">
								<Input
									{...field}
									id="tester-password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
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
					{form.formState.errors.testerPassword ? (
						<p className="text-sm text-red-400">
							{form.formState.errors.testerPassword.message}
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
