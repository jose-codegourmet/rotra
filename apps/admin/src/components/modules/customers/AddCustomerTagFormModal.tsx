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
	callerIsSuperAdmin: boolean;
};

export function AddCustomerTagFormModal({
	open,
	onOpenChange,
	profileId,
	callerIsSuperAdmin,
}: AddCustomerTagFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add tag</DialogTitle>
					<DialogDescription>
						Choose a tag from the catalog. Only active definitions you are
						allowed to assign are listed.
					</DialogDescription>
				</DialogHeader>
				{open ? (
					<AddCustomerTagForm
						profileId={profileId}
						callerIsSuperAdmin={callerIsSuperAdmin}
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
