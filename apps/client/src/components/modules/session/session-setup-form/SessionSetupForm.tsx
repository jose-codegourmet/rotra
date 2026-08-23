"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	ArrowRight,
	Calendar,
	Clock,
	Loader2,
	MapPin,
	Minus,
	Plus,
	User,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import { DatePicker } from "@/components/ui/date-picker/DatePicker";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field/Field";
import { Input } from "@/components/ui/input/Input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select/NativeSelect";
import { Pill } from "@/components/ui/pill/Pill";
import {
	SESSION_SETUP_COURTS,
	SESSION_SETUP_DURATION_HOURS,
	SESSION_SETUP_PLAYERS,
} from "@/constants/mock-session-setup";
import { cn } from "@/lib/utils";
import { defaultSessionSetupValues } from "./default";
import {
	acceptedCapacity,
	formatDurationOption,
	SESSION_SETUP_START_TIME_OPTIONS,
} from "./SessionSetupForm.helpers";
import { type SessionSetupFormValues, sessionSetupFormSchema } from "./schema";

const fieldControlClassName =
	"h-12 w-full rounded-lg border-border bg-bg-base text-body font-semibold text-text-primary";

const nativeSelectClassName =
	"w-full [&_[data-slot=native-select]]:h-12 [&_[data-slot=native-select]]:border-border [&_[data-slot=native-select]]:bg-bg-base [&_[data-slot=native-select]]:text-body [&_[data-slot=native-select]]:font-semibold [&_[data-slot=native-select]]:text-text-primary";

export type SessionSetupFormProps = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	initialValues?: Partial<SessionSetupFormValues>;
};

export function SessionSetupForm({
	onSuccess,
	onError,
	initialValues,
}: SessionSetupFormProps) {
	const form = useForm<SessionSetupFormValues>({
		resolver: zodResolver(sessionSetupFormSchema),
		defaultValues: {
			...defaultSessionSetupValues(),
			...initialValues,
		},
		mode: "onBlur",
	});

	const { control, handleSubmit, formState } = form;
	const numCourts = useWatch({ control, name: "numCourts" });
	const playersPerCourt = useWatch({ control, name: "playersPerCourt" });
	const startTime = useWatch({ control, name: "startTime" });
	const accepted = acceptedCapacity(numCourts ?? 0, playersPerCourt ?? 0);

	const mutation = useMutation({
		mutationFn: async (_values: SessionSetupFormValues) => undefined,
		onSuccess: () => {
			toast.success("Session created.");
			onSuccess?.();
		},
		onError: (error) => {
			const safeMessage =
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.";
			toast.error(safeMessage);
			onError?.(error instanceof Error ? error : new Error(safeMessage));
		},
	});

	const isPending = mutation.isPending;
	const onSubmit = handleSubmit((values) => {
		if (isPending) return;
		mutation.mutate(values);
	});

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-4">
			<header className="flex items-start justify-between gap-4 pt-6">
				<div>
					<p className="text-heading font-bold uppercase tracking-wide text-text-primary">
						ROTRA
					</p>
					<p className="text-small text-text-secondary">Run the game.</p>
				</div>
				<Pill variant="accent" className="gap-1.5 font-semibold">
					<span className="size-1.5 rounded-full bg-accent" aria-hidden />
					TESTER NIGHT
				</Pill>
			</header>

			<p className="mt-5 flex items-center gap-2 text-small text-text-secondary">
				<span className="size-2 rounded-full bg-warning" aria-hidden />
				DRAFT · NOT LIVE
			</p>

			<h1 className="mt-4 text-display font-bold tracking-tight text-text-primary">
				New session
			</h1>
			<p className="mt-2 text-body text-text-secondary">
				Set location, clock, courts, and format for tonight’s tester queue.
				Testers with the link
			</p>

			<FormProvider {...form}>
				<form onSubmit={onSubmit} className="mt-6 flex flex-1 flex-col gap-4">
					<section className="space-y-3 rounded-xl border border-border bg-bg-surface p-4">
						<Field data-invalid={!!formState.errors.location}>
							<FieldLabel
								htmlFor="session-setup-location"
								className="text-micro font-medium uppercase tracking-widest text-text-secondary"
							>
								<MapPin className="size-3.5" aria-hidden />
								Location
							</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="location"
									render={({ field, fieldState }) => (
										<>
											<Input
												{...field}
												id="session-setup-location"
												disabled={isPending}
												aria-invalid={!!fieldState.error}
												className={fieldControlClassName}
											/>
											<FieldError errors={[fieldState.error]} />
										</>
									)}
								/>
							</FieldContent>
						</Field>
					</section>

					<section className="space-y-3 rounded-xl border border-border bg-bg-surface p-4">
						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!formState.errors.date}>
								<FieldLabel className="text-micro font-medium uppercase tracking-widest text-text-secondary">
									<Calendar className="size-3.5" aria-hidden />
									Date
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="date"
										render={({ field, fieldState }) => (
											<>
												<DatePicker
													value={field.value}
													onChange={field.onChange}
													fromDate={new Date()}
													disabled={isPending}
													displayFormat="EEE, MMM d"
													className={cn(
														fieldControlClassName,
														"justify-between px-3",
													)}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>

							<Field data-invalid={!!formState.errors.startTime}>
								<FieldLabel
									htmlFor="session-setup-start"
									className="text-micro font-medium uppercase tracking-widest text-text-secondary"
								>
									<Clock className="size-3.5" aria-hidden />
									Start
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="startTime"
										render={({ field, fieldState }) => (
											<>
												<NativeSelect
													id="session-setup-start"
													className={nativeSelectClassName}
													disabled={isPending}
													value={field.value}
													onChange={field.onChange}
													onBlur={field.onBlur}
													aria-invalid={!!fieldState.error}
												>
													{SESSION_SETUP_START_TIME_OPTIONS.map((option) => (
														<NativeSelectOption
															key={option.value}
															value={option.value}
														>
															{option.label}
														</NativeSelectOption>
													))}
												</NativeSelect>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
						</div>

						<Field data-invalid={!!formState.errors.durationHours}>
							<FieldLabel
								htmlFor="session-setup-duration"
								className="text-micro font-medium uppercase tracking-widest text-text-secondary"
							>
								<ArrowRight className="size-3.5" aria-hidden />
								Duration
							</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="durationHours"
									render={({ field, fieldState }) => (
										<>
											<NativeSelect
												id="session-setup-duration"
												className={nativeSelectClassName}
												disabled={isPending}
												value={String(field.value)}
												onChange={(event) =>
													field.onChange(Number(event.target.value))
												}
												onBlur={field.onBlur}
												aria-invalid={!!fieldState.error}
											>
												{SESSION_SETUP_DURATION_HOURS.map((hours) => (
													<NativeSelectOption key={hours} value={String(hours)}>
														{formatDurationOption(hours, startTime ?? "19:00")}
													</NativeSelectOption>
												))}
											</NativeSelect>
											<FieldError errors={[fieldState.error]} />
										</>
									)}
								/>
							</FieldContent>
						</Field>
					</section>

					<section className="space-y-4 rounded-xl border border-border bg-bg-surface p-4">
						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!formState.errors.numCourts}>
								<FieldLabel className="text-micro font-medium uppercase tracking-widest text-text-secondary">
									Courts
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="numCourts"
										render={({ field, fieldState }) => (
											<>
												<StepperControl
													value={field.value}
													min={SESSION_SETUP_COURTS.min}
													max={SESSION_SETUP_COURTS.max}
													disabled={isPending}
													decreaseLabel="Decrease courts"
													increaseLabel="Increase courts"
													onChange={field.onChange}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>

							<Field data-invalid={!!formState.errors.playersPerCourt}>
								<FieldLabel className="text-micro font-medium uppercase tracking-widest text-text-secondary">
									Players / court
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="playersPerCourt"
										render={({ field, fieldState }) => (
											<>
												<StepperControl
													value={field.value}
													min={SESSION_SETUP_PLAYERS.min}
													max={SESSION_SETUP_PLAYERS.max}
													step={SESSION_SETUP_PLAYERS.step}
													disabled={isPending}
													decreaseLabel="Decrease players per court"
													increaseLabel="Increase players per court"
													onChange={field.onChange}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
						</div>

						<p className="text-small text-text-secondary">
							<span className="font-semibold text-accent">
								{accepted} accepted
							</span>
							{" · rest waitlisted"}
						</p>

						<Field data-invalid={!!formState.errors.format}>
							<FieldLabel className="text-micro font-medium uppercase tracking-widest text-text-secondary">
								Format
							</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="format"
									render={({ field, fieldState }) => (
										<>
											<fieldset className="m-0 grid grid-cols-2 gap-2 border-0 p-0">
												<legend className="sr-only">Match format</legend>
												<FormatOption
													pressed={field.value === "singles"}
													disabled={isPending}
													icon={<User className="size-4" aria-hidden />}
													label="Singles"
													onClick={() => field.onChange("singles")}
												/>
												<FormatOption
													pressed={field.value === "doubles"}
													disabled={isPending}
													icon={<Users className="size-4" aria-hidden />}
													label="Doubles"
													onClick={() => field.onChange("doubles")}
												/>
											</fieldset>
											<FieldError errors={[fieldState.error]} />
										</>
									)}
								/>
							</FieldContent>
						</Field>
					</section>

					<div className="sticky bottom-0 mt-auto bg-bg-base pt-3">
						<Button
							type="submit"
							size="lg"
							disabled={isPending}
							className="h-12 w-full text-small font-black uppercase tracking-widest"
						>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" aria-hidden />
									<span className="sr-only">Creating session</span>
								</>
							) : (
								"CREATE SESSION"
							)}
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}

SessionSetupForm.displayName = "SessionSetupForm";

function StepperControl({
	value,
	min,
	max,
	step = 1,
	disabled,
	decreaseLabel,
	increaseLabel,
	onChange,
}: {
	value: number;
	min: number;
	max: number;
	step?: number;
	disabled: boolean;
	decreaseLabel: string;
	increaseLabel: string;
	onChange: (value: number) => void;
}) {
	return (
		<div className="flex items-center justify-between rounded-lg bg-bg-base px-1 py-1">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled={disabled || value <= min}
				onClick={() => onChange(Math.max(min, value - step))}
				aria-label={decreaseLabel}
				className="text-text-secondary hover:text-text-primary"
			>
				<Minus className="size-4" />
			</Button>
			<span className="min-w-8 text-center text-title font-bold tabular-nums text-text-primary">
				{value}
			</span>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				disabled={disabled || value >= max}
				onClick={() => onChange(Math.min(max, value + step))}
				aria-label={increaseLabel}
				className="text-accent hover:text-accent-dim"
			>
				<Plus className="size-4" />
			</Button>
		</div>
	);
}

function FormatOption({
	pressed,
	disabled,
	icon,
	label,
	onClick,
}: {
	pressed: boolean;
	disabled: boolean;
	icon: ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<Button
			type="button"
			variant="outline"
			disabled={disabled}
			aria-pressed={pressed}
			onClick={onClick}
			className={cn(
				"h-12 uppercase tracking-widest",
				pressed
					? "border-accent text-accent hover:bg-accent-subtle"
					: "border-border text-text-secondary hover:text-text-primary",
			)}
		>
			{icon}
			{label}
		</Button>
	);
}
