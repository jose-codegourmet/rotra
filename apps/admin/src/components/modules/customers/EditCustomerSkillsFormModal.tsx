"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { EditCustomerSkillsForm } from "./edit-customer-skills-form/EditCustomerSkillsForm";

export type EditCustomerSkillsFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: CustomerProfileSerialized;
};

export function EditCustomerSkillsFormModal({
	open,
	onOpenChange,
	profile,
}: EditCustomerSkillsFormModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit skills & preferences</DialogTitle>
					<DialogDescription>
						Update playing level, format, court position, and play mode. Choose
						“Not set” to clear a field.
					</DialogDescription>
				</DialogHeader>
				{open ? (
					<EditCustomerSkillsForm
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

EditCustomerSkillsFormModal.displayName = "EditCustomerSkillsFormModal";
