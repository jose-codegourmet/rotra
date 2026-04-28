"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button/Button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input/Input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select";
import {
	APPLICATION_REJECTION_REASONS,
	applicationRejectionReasonLabel,
} from "@/constants/club-application-reject";
import {
	bulkRejectClubApplicationsRequest,
	rejectClubApplicationRequest,
} from "@/hooks/useClubApplications/server";

import { rejectReasonFormDefault } from "./default";
import { type RejectReasonFormValues, rejectReasonFormSchema } from "./schema";

export type RejectReasonMutationTarget =
	| { type: "single"; applicationId: string }
	| { type: "bulk"; applicationIds: string[] };

export type RejectReasonFormProps = {
	mutationTarget: RejectReasonMutationTarget;
	onDismiss: () => void;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

const toast = {
	success: (_message: string) => {},
	error: (_message: string) => {},
};

export function RejectReasonForm({
	mutationTarget,
	onDismiss,
	onSuccess,
	onError,
}: RejectReasonFormProps) {
	const form = useForm<RejectReasonFormValues>({
		resolver: zodResolver(rejectReasonFormSchema),
		defaultValues: rejectReasonFormDefault,
	});
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	const mutation = useMutation({
		mutationFn: async (values: RejectReasonFormValues) => {
			if (mutationTarget.type === "bulk") {
				if (mutationTarget.applicationIds.length === 0) {
					throw new Error("No selectable applications to reject.");
				}
				await bulkRejectClubApplicationsRequest({
					applicationIds: mutationTarget.applicationIds,
					reason: values.reason,
					...(values.reviewNote ? { reviewNote: values.reviewNote } : {}),
				});
				return;
			}
			if (!mutationTarget.applicationId) {
				throw new Error("No application selected for rejection.");
			}

			await rejectClubApplicationRequest({
				applicationId: mutationTarget.applicationId,
				reason: values.reason,
				...(values.reviewNote ? { reviewNote: values.reviewNote } : {}),
			});
		},
		onSuccess: () => {
			toast.success("Application rejection saved.");
			onSuccess();
			reset(rejectReasonFormDefault);
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
			<form onSubmit={onSubmit}>
				<div className="space-y-4 py-2">
					<Field data-invalid={!!errors.reason}>
						<FieldLabel htmlFor="reject-reason">Reason</FieldLabel>
						<FieldContent>
							<Controller
								control={control}
								name="reason"
								render={({ field, fieldState }) => (
									<>
										<NativeSelect
											id="reject-reason"
											className="w-full"
											disabled={isPending}
											aria-invalid={!!fieldState.error}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											name={field.name}
											ref={field.ref}
										>
											{APPLICATION_REJECTION_REASONS.map((code) => (
												<NativeSelectOption key={code} value={code}>
													{applicationRejectionReasonLabel(code)}
												</NativeSelectOption>
											))}
										</NativeSelect>
										<FieldError errors={[fieldState.error]} />
									</>
								)}
							/>
						</FieldContent>
					</Field>

					<Field data-invalid={!!errors.reviewNote}>
						<FieldLabel htmlFor="reject-note">
							Note for applicant (optional)
						</FieldLabel>
						<FieldContent>
							<Controller
								control={control}
								name="reviewNote"
								render={({ field, fieldState }) => (
									<>
										<Input
											id="reject-note"
											type="text"
											disabled={isPending}
											placeholder="Optional context"
											aria-invalid={!!fieldState.error}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											name={field.name}
											ref={field.ref}
										/>
										<FieldError errors={[fieldState.error]} />
									</>
								)}
							/>
						</FieldContent>
					</Field>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={isPending}
						onClick={onDismiss}
					>
						Cancel
					</Button>
					<Button type="submit" variant="destructive" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden />
								<span className="sr-only">Rejecting application</span>
							</>
						) : (
							"Reject"
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}
