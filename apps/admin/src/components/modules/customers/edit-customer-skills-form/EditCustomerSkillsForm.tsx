"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	CourtPosition,
	FormatPreference,
	PlayingLevel,
	PlayMode,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select/NativeSelect";
import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";
import { patchCustomerSkills } from "@/hooks/useCustomerDetail/server";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { buildEditCustomerSkillsFormDefaults } from "./default";
import {
	type EditCustomerSkillsFormValues,
	editCustomerSkillsFormSchema,
} from "./schema";

const PLAYING_LEVELS = Object.values(PlayingLevel);
const FORMAT_PREFS = Object.values(FormatPreference);
const COURT_POSITIONS = Object.values(CourtPosition);
const PLAY_MODES = Object.values(PlayMode);

function humanizeEnum(value: string): string {
	return value
		.split("_")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export type EditCustomerSkillsFormProps = {
	profileId: string;
	profile: CustomerProfileSerialized;
	onDismiss: () => void;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

export function EditCustomerSkillsForm({
	profileId,
	profile,
	onDismiss,
	onSuccess,
	onError,
}: EditCustomerSkillsFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const defaultValues = buildEditCustomerSkillsFormDefaults(profile);
	const form = useForm<EditCustomerSkillsFormValues>({
		resolver: zodResolver(editCustomerSkillsFormSchema),
		defaultValues,
	});
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = form;

	const mutation = useMutation({
		mutationFn: (values: EditCustomerSkillsFormValues) =>
			patchCustomerSkills(profileId, {
				playingLevel: values.playingLevel === "" ? null : values.playingLevel,
				formatPreference:
					values.formatPreference === "" ? null : values.formatPreference,
				courtPosition:
					values.courtPosition === "" ? null : values.courtPosition,
				playMode: values.playMode === "" ? null : values.playMode,
			}),
		onSuccess: () => {
			toast.success("Skills and preferences updated.");
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
			onSuccess();
			router.refresh();
		},
		onError: (error) => {
			const safeMessage =
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.";
			toast.error(safeMessage);
			onError(error instanceof Error ? error : new Error(safeMessage));
		},
	});

	const isPending = mutation.isPending;
	const onSubmit = handleSubmit((values) => {
		if (isPending) return;
		mutation.mutate(values);
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<Field data-invalid={!!errors.playingLevel}>
					<FieldLabel htmlFor="edit-playing-level">Playing level</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="playingLevel"
							render={({ field, fieldState }) => (
								<>
									<NativeSelect
										id="edit-playing-level"
										className="w-full"
										disabled={isPending}
										aria-invalid={!!fieldState.error}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									>
										<NativeSelectOption value="">Not set</NativeSelectOption>
										{PLAYING_LEVELS.map((v) => (
											<NativeSelectOption key={v} value={v}>
												{humanizeEnum(v)}
											</NativeSelectOption>
										))}
									</NativeSelect>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<Field data-invalid={!!errors.formatPreference}>
					<FieldLabel htmlFor="edit-format-pref">Format preference</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="formatPreference"
							render={({ field, fieldState }) => (
								<>
									<NativeSelect
										id="edit-format-pref"
										className="w-full"
										disabled={isPending}
										aria-invalid={!!fieldState.error}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									>
										<NativeSelectOption value="">Not set</NativeSelectOption>
										{FORMAT_PREFS.map((v) => (
											<NativeSelectOption key={v} value={v}>
												{humanizeEnum(v)}
											</NativeSelectOption>
										))}
									</NativeSelect>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<Field data-invalid={!!errors.courtPosition}>
					<FieldLabel htmlFor="edit-court-position">Court position</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="courtPosition"
							render={({ field, fieldState }) => (
								<>
									<NativeSelect
										id="edit-court-position"
										className="w-full"
										disabled={isPending}
										aria-invalid={!!fieldState.error}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									>
										<NativeSelectOption value="">Not set</NativeSelectOption>
										{COURT_POSITIONS.map((v) => (
											<NativeSelectOption key={v} value={v}>
												{humanizeEnum(v)}
											</NativeSelectOption>
										))}
									</NativeSelect>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<Field data-invalid={!!errors.playMode}>
					<FieldLabel htmlFor="edit-play-mode">Play mode</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="playMode"
							render={({ field, fieldState }) => (
								<>
									<NativeSelect
										id="edit-play-mode"
										className="w-full"
										disabled={isPending}
										aria-invalid={!!fieldState.error}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									>
										<NativeSelectOption value="">Not set</NativeSelectOption>
										{PLAY_MODES.map((v) => (
											<NativeSelectOption key={v} value={v}>
												{humanizeEnum(v)}
											</NativeSelectOption>
										))}
									</NativeSelect>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<div className="flex justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						disabled={isPending}
						onClick={onDismiss}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden />
								<span className="sr-only">Saving</span>
							</>
						) : (
							"Save"
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}

EditCustomerSkillsForm.displayName = "EditCustomerSkillsForm";
