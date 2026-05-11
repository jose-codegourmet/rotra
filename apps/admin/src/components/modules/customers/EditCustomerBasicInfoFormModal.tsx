"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { EditCustomerBasicInfoForm } from "./edit-customer-basic-info-form/EditCustomerBasicInfoForm";

export type EditCustomerBasicInfoFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: CustomerProfileSerialized;
};

export function EditCustomerBasicInfoFormModal({
	open,
	onOpenChange,
	profile,
}: EditCustomerBasicInfoFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit basic information</DialogTitle>
					<DialogDescription>
						Update name, email, and phone. Empty email or phone clears the
						field.
					</DialogDescription>
				</DialogHeader>
				{open ? (
					<EditCustomerBasicInfoForm
						key={profile.updatedAt}
						profileId={profile.id}
						profile={profile}
						onDismiss={() => onOpenChange(false)}
						onSuccess={() => onOpenChange(false)}
						onError={() => {}}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

EditCustomerBasicInfoFormModal.displayName = "EditCustomerBasicInfoFormModal";
