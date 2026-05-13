"use client";

import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";

export interface SignOutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	pending: boolean;
	error: string | null;
	onCancel: () => void;
	onConfirm: () => void;
}

export function SignOutDialog({
	open,
	onOpenChange,
	pending,
	error,
	onCancel,
	onConfirm,
}: SignOutDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (pending) return;
				onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Sign out of admin?</DialogTitle>
					<DialogDescription>
						You will be signed out of your current admin session and returned to
						the login page.
					</DialogDescription>
				</DialogHeader>
				{error ? <p className="text-small text-danger">{error}</p> : null}
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={pending}
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button type="button" disabled={pending} onClick={onConfirm}>
						{pending ? "Signing out..." : "Sign out"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

SignOutDialog.displayName = "SignOutDialog";
