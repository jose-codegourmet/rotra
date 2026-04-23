"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";

import { emptyRejectReasonForm } from "./reject-reason-form/defaults";
import { RejectReasonForm } from "./reject-reason-form/RejectReasonForm";
import {
	rejectReasonFormSchema,
	type ClubApplicationRejectFormValues,
} from "./reject-reason-form/schema";

export type RejectReasonFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	busy: boolean;
	onSubmit: (values: ClubApplicationRejectFormValues) => void;
};

export function RejectReasonFormModal({
	open,
	onOpenChange,
	title = "Reject application",
	busy,
	onSubmit,
}: RejectReasonFormModalProps) {
	const form = useForm<ClubApplicationRejectFormValues>({
		resolver: zodResolver(rejectReasonFormSchema),
		defaultValues: emptyRejectReasonForm(),
	});

	const { register, handleSubmit, reset, formState } = form;

	useEffect(() => {
		if (open) {
			reset(emptyRejectReasonForm());
		}
	}, [open, reset]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<form
					onSubmit={handleSubmit((values: ClubApplicationRejectFormValues) =>
						onSubmit(values),
					)}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>
							Choose a reason code. An optional note may be shown to the
							applicant.
						</DialogDescription>
					</DialogHeader>
					<RejectReasonForm
						disabled={busy}
						register={register}
						formState={formState}
					/>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={busy}
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" variant="destructive" disabled={busy}>
							{busy ? "Rejecting…" : "Reject"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
