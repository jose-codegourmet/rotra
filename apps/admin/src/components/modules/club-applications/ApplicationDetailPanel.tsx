"use client";

import { Button } from "@/components/ui/button/Button";
import type { ClubNameCollisionDto } from "@/hooks/useClubApplications/server";
import { playerProfileUrl } from "@/lib/client-app-url";
import { expectedPlayerBucketLabel } from "@/lib/expected-player-bucket-labels";
import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

import { NameCollisionBanner } from "./NameCollisionBanner";

export type ApplicationDetailPanelProps = {
	row: ClubApplicationListRowDto | null;
	collisions: ClubNameCollisionDto[];
	collisionsLoading: boolean;
	onApprove: () => void;
	onReject: () => void;
	onFilterByApplicant: (playerId: string) => void;
	actionsDisabled: boolean;
};

export function ApplicationDetailPanel({
	row,
	collisions,
	collisionsLoading,
	onApprove,
	onReject,
	onFilterByApplicant,
	actionsDisabled,
}: ApplicationDetailPanelProps) {
	if (!row) {
		return (
			<div className="rounded-lg border border-border border-dashed p-6 text-small text-text-secondary">
				Select an application from the queue to review details.
			</div>
		);
	}

	const profileHref = playerProfileUrl(row.playerId);

	return (
		<div className="rounded-lg border border-border bg-bg-surface p-4 md:p-5 space-y-4 shadow-card">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-heading font-bold text-text-primary">
						{row.clubName}
					</h2>
					<p className="text-small text-text-secondary mt-1">
						Applicant:{" "}
						<span className="text-text-primary font-medium">
							{row.applicantName}
						</span>{" "}
						{row.applicantEmail ? (
							<span className="text-text-disabled">({row.applicantEmail})</span>
						) : null}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{profileHref ? (
						<Button variant="outline" size="sm" asChild>
							<a href={profileHref} target="_blank" rel="noopener noreferrer">
								View profile
							</a>
						</Button>
					) : null}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-accent"
						onClick={() => onFilterByApplicant(row.playerId)}
					>
						Previous applications
					</Button>
				</div>
			</div>

			{collisionsLoading ? (
				<p className="text-small text-text-secondary">Checking name collisions…</p>
			) : (
				<NameCollisionBanner clubs={collisions} />
			)}

			<div className="rounded-md border border-border bg-bg-elevated p-3 text-small text-text-secondary space-y-2">
				<p className="text-micro font-bold uppercase tracking-widest text-text-primary">
					Player activity
				</p>
				<p>Not available in this MVP build.</p>
			</div>

			<dl className="grid gap-3 text-small">
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Description
					</dt>
					<dd className="text-text-primary mt-0.5 whitespace-pre-wrap">
						{row.description}
					</dd>
				</div>
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Intent
					</dt>
					<dd className="text-text-primary mt-0.5 whitespace-pre-wrap">
						{row.intent}
					</dd>
				</div>
				<div className="grid sm:grid-cols-2 gap-3">
					<div>
						<dt className="text-micro font-bold uppercase text-text-secondary">
							City
						</dt>
						<dd className="text-text-primary mt-0.5">{row.locationCity}</dd>
					</div>
					<div>
						<dt className="text-micro font-bold uppercase text-text-secondary">
							Venue
						</dt>
						<dd className="text-text-primary mt-0.5">{row.locationVenue}</dd>
					</div>
				</div>
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Address
					</dt>
					<dd className="text-text-primary mt-0.5 whitespace-pre-wrap">
						{row.venueAddress}
					</dd>
				</div>
				<div className="grid sm:grid-cols-2 gap-3">
					<div>
						<dt className="text-micro font-bold uppercase text-text-secondary">
							Facebook page
						</dt>
						<dd className="text-text-primary mt-0.5 break-all">
							{row.facebookPageUrl ?? "—"}
						</dd>
					</div>
					<div>
						<dt className="text-micro font-bold uppercase text-text-secondary">
							Facebook profile
						</dt>
						<dd className="text-text-primary mt-0.5 break-all">
							{row.facebookProfileUrl ?? "—"}
						</dd>
					</div>
				</div>
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Contact
					</dt>
					<dd className="text-text-primary mt-0.5">{row.contactNumber ?? "—"}</dd>
				</div>
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Expected players
					</dt>
					<dd className="text-text-primary mt-0.5">
						{expectedPlayerBucketLabel(row.expectedPlayerCount)}
					</dd>
				</div>
				<div>
					<dt className="text-micro font-bold uppercase text-text-secondary">
						Notes
					</dt>
					<dd className="text-text-primary mt-0.5 whitespace-pre-wrap">
						{row.additionalNotes ?? "—"}
					</dd>
				</div>
			</dl>

			{row.status === "pending" || row.status === "in_review" ? (
				<div className="flex flex-wrap gap-2 pt-2 border-t border-border">
					<Button type="button" disabled={actionsDisabled} onClick={onApprove}>
						Approve
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={actionsDisabled}
						onClick={onReject}
					>
						Reject
					</Button>
				</div>
			) : (
				<p className="text-small text-text-disabled pt-2 border-t border-border">
					No actions for this status.
				</p>
			)}
		</div>
	);
}
