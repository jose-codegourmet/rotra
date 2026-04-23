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

export type ApproveConfirmModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	clubName: string;
	applicantName: string;
	busy: boolean;
	onConfirm: () => void;
};

export function ApproveConfirmModal({
	open,
	onOpenChange,
	clubName,
	applicantName,
	busy,
	onConfirm,
}: ApproveConfirmModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Approve club application?</DialogTitle>
					<DialogDescription>
						This will create the club <strong>{clubName}</strong> and assign{" "}
						<strong>{applicantName}</strong> as owner. This action is logged for
						audit.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						disabled={busy}
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="button" disabled={busy} onClick={onConfirm}>
						{busy ? "Approving…" : "Approve"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
