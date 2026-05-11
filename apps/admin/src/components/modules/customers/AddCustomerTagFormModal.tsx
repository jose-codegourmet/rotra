"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";

import { AddCustomerTagForm } from "./add-customer-tag-form/AddCustomerTagForm";

export type AddCustomerTagFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profileId: string;
};

export function AddCustomerTagFormModal({
	open,
	onOpenChange,
	profileId,
}: AddCustomerTagFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add tag</DialogTitle>
					<DialogDescription>
						Tags are internal labels for filtering and feature access. Slug is
						derived from the label (spaces become hyphens).
					</DialogDescription>
				</DialogHeader>
				{open ? (
					<AddCustomerTagForm
						profileId={profileId}
						onDismiss={() => onOpenChange(false)}
						onSuccess={() => onOpenChange(false)}
						onError={() => {}}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

AddCustomerTagFormModal.displayName = "AddCustomerTagFormModal";
