"use client";

import type { FormState, UseFormRegister } from "react-hook-form";

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

import type { RejectReasonFormValues } from "./schema";

export type RejectReasonFormProps = {
	disabled?: boolean;
	register: UseFormRegister<RejectReasonFormValues>;
	formState: FormState<RejectReasonFormValues>;
};

export function RejectReasonForm({
	disabled,
	register,
	formState,
}: RejectReasonFormProps) {
	const { errors } = formState;

	return (
		<div className="space-y-4 py-2">
			<Field data-invalid={!!errors.reason}>
				<FieldLabel htmlFor="reject-reason">Reason</FieldLabel>
				<FieldContent>
					<NativeSelect
						id="reject-reason"
						className="w-full"
						disabled={disabled}
						aria-invalid={!!errors.reason}
						{...register("reason")}
					>
						{APPLICATION_REJECTION_REASONS.map((code) => (
							<NativeSelectOption key={code} value={code}>
								{applicationRejectionReasonLabel(code)}
							</NativeSelectOption>
						))}
					</NativeSelect>
					<FieldError errors={[errors.reason]} />
				</FieldContent>
			</Field>

			<Field data-invalid={!!errors.reviewNote}>
				<FieldLabel htmlFor="reject-note">Note for applicant (optional)</FieldLabel>
				<FieldContent>
					<Input
						id="reject-note"
						type="text"
						disabled={disabled}
						placeholder="Optional context"
						aria-invalid={!!errors.reviewNote}
						{...register("reviewNote")}
					/>
					<FieldError errors={[errors.reviewNote]} />
				</FieldContent>
			</Field>
		</div>
	);
}
