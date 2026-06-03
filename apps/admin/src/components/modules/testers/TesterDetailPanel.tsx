"use client";

import type { TesterDirectoryStatus } from "@rotra/db";
import Link from "next/link";
import { Button } from "@/components/ui/button/Button";
import { ROUTES } from "@/constants/admin";
import {
	useResendTesterInvite,
	useRevokeTesterInvite,
	useTesterDetail,
} from "@/hooks/useTesters/client";
import type { TestersListQueryFilters } from "@/hooks/useTesters/queryKey";
import type { TesterDetailResponse } from "@/hooks/useTesters/server";
import { cn } from "@/lib/utils/tailwind";

import { TesterInvitationStatusPill } from "./TesterInvitationStatusPill";

function deriveDirectoryStatus(
	invitations: TesterDetailResponse["profile"]["invitations"],
): TesterDirectoryStatus {
	const latest = invitations[0];
	if (!latest) return "pending";
	if (latest.status === "revoked") return "revoked";
	if (latest.status === "accepted") return "active";
	if (latest.status === "expired") return "expired";
	if (
		latest.status === "pending" &&
		new Date(latest.expiresAt).getTime() < Date.now()
	) {
		return "expired";
	}
	return "pending";
}

export function TesterDetailPanel({
	profileId,
	listFilters,
	initialDetail,
}: {
	profileId: string;
	listFilters: TestersListQueryFilters;
	initialDetail: TesterDetailResponse;
}) {
	const { data } = useTesterDetail(profileId, { initialData: initialDetail });
	const profile = data?.profile ?? initialDetail.profile;
	const status = deriveDirectoryStatus(profile.invitations);
	const resend = useResendTesterInvite(profileId, listFilters);
	const revoke = useRevokeTesterInvite(profileId, listFilters);
	const showResend = status === "pending" || status === "expired";
	const showRevoke = status === "pending";

	return (
		<div className="mx-auto max-w-3xl space-y-8">
			<div>
				<Link
					href={ROUTES.TESTERS}
					className="text-body text-accent hover:underline"
				>
					← Back to testers
				</Link>
			</div>

			<section className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-heading text-text-primary">{profile.name}</h1>
						<p className="mt-1 text-body text-text-secondary">
							{profile.email ?? "No email"}
						</p>
					</div>
					<TesterInvitationStatusPill status={status} />
				</div>

				<div className="flex flex-wrap gap-2">
					{showResend ? (
						<Button
							type="button"
							variant="outline"
							disabled={resend.isPending}
							onClick={() => resend.mutate()}
						>
							Resend invite
						</Button>
					) : null}
					{showRevoke ? (
						<Button
							type="button"
							variant="outline"
							disabled={revoke.isPending}
							onClick={() => revoke.mutate()}
						>
							Revoke invite
						</Button>
					) : null}
				</div>

				<div>
					<h2 className="text-label uppercase text-text-secondary">Tags</h2>
					<div className="mt-2 flex flex-wrap gap-2">
						{profile.tags.length === 0 ? (
							<p className="text-body text-text-secondary">No tags.</p>
						) : (
							profile.tags.map((tag) => (
								<span
									key={tag.id}
									className={cn(
										"rounded-full border border-border bg-bg-elevated px-3 py-1 text-body",
									)}
									title={tag.slug}
								>
									{tag.label}
								</span>
							))
						)}
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-heading text-text-primary">Invitation history</h2>
				<div className="overflow-x-auto rounded-lg border border-border">
					<table className="w-full text-left text-body">
						<thead className="border-b border-border bg-bg-elevated text-label uppercase text-text-secondary">
							<tr>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Invited by</th>
								<th className="px-4 py-3">Created</th>
								<th className="px-4 py-3">Expires</th>
							</tr>
						</thead>
						<tbody>
							{profile.invitations.map((inv) => (
								<tr
									key={inv.id}
									className="border-b border-border last:border-0"
								>
									<td className="px-4 py-3 capitalize">{inv.status}</td>
									<td className="px-4 py-3">{inv.invitedByName ?? "—"}</td>
									<td className="px-4 py-3 text-text-secondary">
										{new Date(inv.createdAt).toLocaleString()}
									</td>
									<td className="px-4 py-3 text-text-secondary">
										{new Date(inv.expiresAt).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
