"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button/Button";
import { DatePicker } from "@/components/ui/date-picker/DatePicker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
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
import { VenuePicker } from "@/components/ui/venue-picker/VenuePicker";
import { useMyClubs } from "@/hooks/useMyClubs";
import { useQuickSessionMutation } from "@/hooks/useQuickSessionMutation";
import { cn } from "@/lib/utils";
import { defaultQuickSessionValues } from "./default";
import { type QuickSessionFormValues, quickSessionFormSchema } from "./schema";

export interface QuickSessionSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
	/** Optional overrides for Storybook / tests. */
	initialValues?: Partial<QuickSessionFormValues>;
}

export function QuickSessionSheet({
	open,
	onOpenChange,
	onSuccess,
	onError,
	initialValues,
}: QuickSessionSheetProps) {
	const { data: clubsData, isLoading: clubsLoading } = useMyClubs();
	const clubs = clubsData?.clubs ?? [];
	const createMutation = useQuickSessionMutation();

	const form = useForm<QuickSessionFormValues>({
		resolver: zodResolver(quickSessionFormSchema),
		defaultValues: defaultQuickSessionValues(),
		mode: "onBlur",
	});

	const { control, handleSubmit, reset, formState } = form;
	const [dialogContainer, setDialogContainer] =
		useState<HTMLDivElement | null>(null);

	const firstClubId = clubs[0]?.id;

	useEffect(() => {
		if (!open) {
			reset(defaultQuickSessionValues());
			return;
		}

		reset({
			...defaultQuickSessionValues(),
			...(firstClubId ? { clubId: firstClubId } : {}),
			...initialValues,
		});
	}, [open, firstClubId, reset, initialValues]);

	const onSubmit = handleSubmit((values) => {
		if (createMutation.isPending) return;
		createMutation.mutate(values, {
			onSuccess: () => {
				onOpenChange(false);
				onSuccess?.();
			},
			onError: (error) => {
				onError?.(error);
			},
		});
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				ref={setDialogContainer}
				className={cn(
					"max-h-[92dvh] overflow-y-auto sm:max-w-lg",
					"top-auto bottom-0 translate-y-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
					"rounded-b-none rounded-t-xl sm:rounded-xl",
				)}
			>
				<DialogHeader>
					<DialogTitle className="text-xl font-black tracking-tight">
						START QUICK SESSION
					</DialogTitle>
					<DialogDescription>
						Set up a casual session. A club is optional — either way, Quick
						Sessions are informal and earn no EXP or Rank.
					</DialogDescription>
				</DialogHeader>

				<FormProvider {...form}>
					<form onSubmit={onSubmit} className="space-y-4">
						<Field data-invalid={!!formState.errors.clubId}>
							<FieldLabel htmlFor="quick-session-club">
								Club{" "}
								<span className="font-normal text-text-secondary">
									(optional)
								</span>
							</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="clubId"
									render={({ field }) => (
										<NativeSelect
											id="quick-session-club"
											className="w-full"
											disabled={clubsLoading || createMutation.isPending}
											value={field.value ?? ""}
											onChange={field.onChange}
											onBlur={field.onBlur}
										>
											<NativeSelectOption value="">
												No club — casual
											</NativeSelectOption>
											{clubs.map((club) => (
												<NativeSelectOption key={club.id} value={club.id}>
													{club.name}
												</NativeSelectOption>
											))}
										</NativeSelect>
									)}
								/>
								<FieldError errors={[formState.errors.clubId]} />
							</FieldContent>
						</Field>

						<Field data-invalid={!!formState.errors.venue}>
							<FieldLabel>Venue</FieldLabel>
							<FieldContent>
								<Controller
									control={control}
									name="venue"
									render={({ field }) => (
										<VenuePicker
											value={field.value}
											onChange={field.onChange}
											disabled={createMutation.isPending}
										/>
									)}
								/>
								<FieldError
									errors={[
										formState.errors.venue?.name,
										formState.errors.venue?.address,
									]}
								/>
							</FieldContent>
						</Field>

						<div className="grid grid-cols-2 gap-4">
							<Field data-invalid={!!formState.errors.date}>
								<FieldLabel>Date</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="date"
										render={({ field }) => (
											<DatePicker
												value={field.value}
												onChange={field.onChange}
												fromDate={new Date()}
												disabled={createMutation.isPending}
												popoverContainer={dialogContainer}
											/>
										)}
									/>
									<FieldError errors={[formState.errors.date]} />
								</FieldContent>
							</Field>

							<Field data-invalid={!!formState.errors.startTime}>
								<FieldLabel htmlFor="quick-session-start-time">
									Start time
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="startTime"
										render={({ field }) => (
											<Input
												id="quick-session-start-time"
												type="time"
												className="w-full"
												disabled={createMutation.isPending}
												{...field}
											/>
										)}
									/>
									<FieldError errors={[formState.errors.startTime]} />
								</FieldContent>
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Field data-invalid={!!formState.errors.numCourts}>
								<FieldLabel>Courts</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="numCourts"
										render={({ field }) => (
											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													size="icon"
													disabled={
														createMutation.isPending || field.value <= 1
													}
													onClick={() =>
														field.onChange(Math.max(1, field.value - 1))
													}
													aria-label="Decrease courts"
												>
													<Minus className="size-4" />
												</Button>
												<span className="min-w-8 text-center text-sm font-semibold">
													{field.value}
												</span>
												<Button
													type="button"
													variant="outline"
													size="icon"
													disabled={
														createMutation.isPending || field.value >= 12
													}
													onClick={() =>
														field.onChange(Math.min(12, field.value + 1))
													}
													aria-label="Increase courts"
												>
													<Plus className="size-4" />
												</Button>
											</div>
										)}
									/>
									<FieldError errors={[formState.errors.numCourts]} />
								</FieldContent>
							</Field>

							<Field data-invalid={!!formState.errors.playersPerCourt}>
								<FieldLabel htmlFor="quick-session-players">
									Players per court
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="playersPerCourt"
										render={({ field }) => (
											<NativeSelect
												id="quick-session-players"
												className="w-full"
												disabled={createMutation.isPending}
												value={field.value}
												onChange={field.onChange}
												onBlur={field.onBlur}
											>
												<NativeSelectOption value="2">2</NativeSelectOption>
												<NativeSelectOption value="4">4</NativeSelectOption>
											</NativeSelect>
										)}
									/>
									<FieldError errors={[formState.errors.playersPerCourt]} />
								</FieldContent>
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Field data-invalid={!!formState.errors.matchFormat}>
								<FieldLabel htmlFor="quick-session-format">
									Match format
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="matchFormat"
										render={({ field }) => (
											<NativeSelect
												id="quick-session-format"
												className="w-full"
												disabled={createMutation.isPending}
												value={field.value}
												onChange={field.onChange}
												onBlur={field.onBlur}
											>
												<NativeSelectOption value="best_of_1">
													Best of 1
												</NativeSelectOption>
												<NativeSelectOption value="best_of_3">
													Best of 3
												</NativeSelectOption>
											</NativeSelect>
										)}
									/>
									<FieldError errors={[formState.errors.matchFormat]} />
								</FieldContent>
							</Field>

							<Field data-invalid={!!formState.errors.scoreLimit}>
								<FieldLabel htmlFor="quick-session-score">
									Score limit
								</FieldLabel>
								<FieldContent>
									<Controller
										control={control}
										name="scoreLimit"
										render={({ field }) => (
											<Input
												id="quick-session-score"
												type="number"
												min={11}
												max={30}
												className="w-full"
												disabled={createMutation.isPending}
												value={field.value}
												onChange={(e) =>
													field.onChange(
														e.target.value === "" ? "" : Number(e.target.value),
													)
												}
												onBlur={field.onBlur}
											/>
										)}
									/>
									<FieldError errors={[formState.errors.scoreLimit]} />
								</FieldContent>
							</Field>
						</div>

						<DialogFooter className="gap-2 pt-2 sm:justify-between">
							<Button
								type="button"
								variant="ghost"
								disabled={createMutation.isPending}
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createMutation.isPending || clubsLoading}
								className="bg-gradient-to-r from-accent to-accent-dim text-bg-base hover:opacity-90"
							>
								{createMutation.isPending ? "Opening…" : "OPEN SESSION"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
