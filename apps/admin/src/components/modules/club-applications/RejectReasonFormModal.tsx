"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";

import {
	RejectReasonForm,
	type RejectReasonMutationTarget,
} from "./reject-reason-form/RejectReasonForm";

export type RejectReasonFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	mutationTarget: RejectReasonMutationTarget;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

export function RejectReasonFormModal({
	open,
	onOpenChange,
	title = "Reject application",
	mutationTarget,
	onSuccess,
	onError,
}: RejectReasonFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						Choose a reason code. An optional note may be shown to the
						applicant.
					</DialogDescription>
				</DialogHeader>
				<RejectReasonForm
					mutationTarget={mutationTarget}
					onDismiss={() => onOpenChange(false)}
					onSuccess={onSuccess}
					onError={onError}
				/>
			</DialogContent>
		</Dialog>
	);
}
