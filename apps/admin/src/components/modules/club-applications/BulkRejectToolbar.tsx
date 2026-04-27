"use client";

import { Button } from "@/components/ui/button/Button";

export type BulkRejectToolbarProps = {
	selectedCount: number;
	disabled: boolean;
	onBulkReject: () => void;
};

export function BulkRejectToolbar({
	selectedCount,
	disabled,
	onBulkReject,
}: BulkRejectToolbarProps) {
	if (selectedCount === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-small">
			<span className="text-text-secondary">
				<strong className="text-text-primary">{selectedCount}</strong> selected
			</span>
			<Button
				type="button"
				variant="destructive"
				size="sm"
				disabled={disabled}
				onClick={onBulkReject}
			>
				Reject selected…
			</Button>
		</div>
	);
}
