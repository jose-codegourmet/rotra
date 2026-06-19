"use client";

import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import { useConfirmPlace, useDeletePlace } from "@/hooks/usePlaces/client";
import type { PlaceRow } from "@/hooks/usePlaces/server";

const submittedAtFmt = new Intl.DateTimeFormat("en-GB", {
	day: "2-digit",
	month: "short",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

export type ReviewPlaceDialogProps = {
	place: PlaceRow;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmSuccess: () => void;
	onDeleteSuccess: () => void;
};

function formatSubmittedAt(iso: string): string {
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? iso : submittedAtFmt.format(date);
}

export function ReviewPlaceDialog({
	place,
	open,
	onOpenChange,
	onConfirmSuccess,
	onDeleteSuccess,
}: ReviewPlaceDialogProps) {
	const confirmMutation = useConfirmPlace();
	const deleteMutation = useDeletePlace();

	const isConfirming = confirmMutation.isPending;
	const isDeleting = deleteMutation.isPending;
	const actionsDisabled = isConfirming || isDeleting;

	function handleConfirm() {
		if (actionsDisabled) return;
		confirmMutation.mutate(
			{ id: place.id },
			{
				onSuccess: () => {
					onConfirmSuccess();
					onOpenChange(false);
				},
			},
		);
	}

	function handleDelete() {
		if (actionsDisabled) return;
		deleteMutation.mutate(
			{ id: place.id },
			{
				onSuccess: () => {
					onDeleteSuccess();
					onOpenChange(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Review submission</DialogTitle>
					<DialogDescription>
						Confirm this player-submitted venue or delete it if invalid.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div>
						<p className="text-micro font-bold uppercase tracking-widest text-text-secondary">
							Name
						</p>
						<p className="mt-1 text-body font-medium text-text-primary">
							{place.name}
						</p>
					</div>

					<div>
						<p className="text-micro font-bold uppercase tracking-widest text-text-secondary">
							Address
						</p>
						<p className="mt-1 text-body text-text-primary">{place.address}</p>
					</div>

					<div className="flex items-start gap-2 text-body text-text-secondary">
						<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
						<span>
							{place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
						</span>
					</div>

					{place.description ? (
						<div>
							<p className="text-micro font-bold uppercase tracking-widest text-text-secondary">
								Description
							</p>
							<p className="mt-1 text-body text-text-primary">
								{place.description}
							</p>
						</div>
					) : null}

					<div>
						<p className="text-micro font-bold uppercase tracking-widest text-text-secondary">
							Submitted by
						</p>
						<p className="mt-1 text-body text-text-primary">
							{place.submittedBy?.displayName ?? "Unknown player"}
						</p>
						<p className="mt-0.5 text-small text-text-secondary">
							{formatSubmittedAt(place.createdAt)}
						</p>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						type="button"
						variant="outline"
						disabled={actionsDisabled}
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={actionsDisabled}
						onClick={handleDelete}
					>
						{isDeleting ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden />
								<span className="sr-only">Deleting</span>
							</>
						) : (
							"Delete"
						)}
					</Button>
					<Button
						type="button"
						disabled={actionsDisabled}
						onClick={handleConfirm}
					>
						{isConfirming ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden />
								<span className="sr-only">Confirming</span>
							</>
						) : (
							"Confirm"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

ReviewPlaceDialog.displayName = "ReviewPlaceDialog";
