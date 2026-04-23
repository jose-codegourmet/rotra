"use client";

import type { ClubApplicationDto } from "@/types/club-application";

const SLA_HOURS = 24;

function formatSlaDeadline(updatedAtIso: string): string {
	const d = new Date(updatedAtIso);
	d.setHours(d.getHours() + SLA_HOURS);
	return d.toLocaleString();
}

export type ClubApplicationPendingBannerProps = {
	pending: ClubApplicationDto;
};

export function ClubApplicationPendingBanner({
	pending,
}: ClubApplicationPendingBannerProps) {
	return (
		<div
			className="rounded-lg border border-warning/50 bg-bg-elevated p-4 text-body text-text-secondary"
			role="status"
		>
			<p className="text-small font-bold uppercase tracking-widest text-warning mb-2">
				Under review
			</p>
			<p className="text-body text-text-primary">
				Your club application is with the ROTRA team. You can still edit your
				details below; saving updates your application and{" "}
				<strong className="text-text-primary">
					restarts the {SLA_HOURS}-hour
				</strong>{" "}
				review window.
			</p>
			<p className="text-small text-text-secondary mt-3">
				If it is not reviewed within {SLA_HOURS} hours from your last save, it
				will close automatically and you can submit again. You will get in-app
				notifications when there is a decision.
			</p>
			<p className="text-micro text-text-disabled mt-2">
				Last updated {new Date(pending.updatedAt).toLocaleString()} · Review
				deadline from last save: {formatSlaDeadline(pending.updatedAt)}
			</p>
		</div>
	);
}
