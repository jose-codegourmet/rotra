"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ClubApplicationApplySkeleton } from "@/components/modules/clubs/club-application/ClubApplicationApplySkeleton";
import { ClubApplicationPendingBanner } from "@/components/modules/clubs/club-application/ClubApplicationPendingBanner";
import { ClubApplicationRejectedPanel } from "@/components/modules/clubs/club-application/ClubApplicationRejectedPanel";
import { ClubApplicationSubmitConfirmDialog } from "@/components/modules/clubs/club-application/ClubApplicationSubmitConfirmDialog";
import { ClubApplicationForm } from "@/components/modules/clubs/club-application-form/ClubApplicationForm";
import type { ClubApplicationCreateFormValues } from "@/components/modules/clubs/club-application-form/schema";
import { Button } from "@/components/ui/button/Button";
import {
	useCancelClubApplicationMutation,
	useMyClubApplication,
	useSaveClubApplicationMutation,
} from "@/hooks/useClubApplication/client";

export default function ClubApplyPage() {
	const router = useRouter();
	const { data, isLoading, error, refetch } = useMyClubApplication();
	const saveMut = useSaveClubApplicationMutation();
	const cancelMut = useCancelClubApplicationMutation();

	const pending = data?.pending ?? null;
	const lastRejected = data?.lastRejected ?? null;

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [submitBody, setSubmitBody] =
		useState<ClubApplicationCreateFormValues | null>(null);
	const [rejectedDismissed, setRejectedDismissed] = useState(false);

	const busy = saveMut.isPending || cancelMut.isPending;

	const syncValues = pending
		? ({
				clubName: pending.clubName,
				description: pending.description,
				intent: pending.intent,
				locationCity: pending.locationCity,
				locationVenue: pending.locationVenue,
				venueAddress: pending.venueAddress,
				facebookPageUrl: pending.facebookPageUrl ?? "",
				facebookProfileUrl: pending.facebookProfileUrl ?? "",
				contactNumber: pending.contactNumber ?? "",
				expectedPlayerCount: pending.expectedPlayerCount,
				additionalNotes: pending.additionalNotes ?? "",
			} satisfies ClubApplicationCreateFormValues)
		: null;

	const showRejected = !pending && lastRejected != null && !rejectedDismissed;

	return (
		<div className="mx-auto w-full max-w-[600px] md:max-w-[640px] p-4 md:p-8 space-y-6">
			<div>
				<p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
					Clubs
				</p>
				<h1 className="text-display font-bold text-text-primary tracking-tight">
					Apply for a new club
				</h1>
				<p className="text-body text-text-secondary mt-2">
					Tell us about your club. An admin will review your application and you
					will be notified in the app.
				</p>
			</div>

			<div className="rounded-lg border border-border bg-bg-surface p-4 text-small text-text-secondary space-y-2">
				<p className="font-semibold text-text-primary">What happens next</p>
				<ul className="list-disc pl-5 space-y-1">
					<li>We route your application to the ROTRA admin team.</li>
					<li>
						You receive in-app notifications when it is approved or rejected.
					</li>
					<li>
						There is a 24-hour review window from your last save: if nobody
						decides in time, the application closes automatically and you can
						submit again right away.
					</li>
				</ul>
			</div>

			<Button variant="link" className="h-auto p-0" asChild>
				<Link href="/clubs">← Back to clubs</Link>
			</Button>

			{isLoading ? <ClubApplicationApplySkeleton /> : null}
			{error ? (
				<p className="text-body text-error" role="alert">
					{String(error.message)}
				</p>
			) : null}

			{!isLoading && !error ? (
				<>
					{pending ? <ClubApplicationPendingBanner pending={pending} /> : null}

					{showRejected ? (
						<ClubApplicationRejectedPanel
							lastRejected={lastRejected}
							onApplyAgain={() => {
								setRejectedDismissed(true);
							}}
						/>
					) : null}

					<ClubApplicationForm
						key={`${pending?.id ?? "new"}-${rejectedDismissed ? "d" : "r"}`}
						syncFromPending={syncValues}
						disabled={busy}
						onValidatedSubmit={(body) => {
							setSubmitBody(body);
							setConfirmOpen(true);
						}}
					/>

					{pending ? (
						<div className="pt-2 border-t border-border">
							<Button
								type="button"
								variant="outline"
								disabled={busy}
								onClick={() => {
									cancelMut.mutate(pending.id, {
										onSuccess: () => {
											toast.success("Application cancelled.");
											void refetch();
										},
										onError: (e) => {
											toast.error(String(e.message));
										},
									});
								}}
							>
								Cancel application
							</Button>
						</div>
					) : null}

					{(saveMut.error || cancelMut.error) && (
						<p className="text-small text-error" role="alert">
							{String(saveMut.error?.message ?? cancelMut.error?.message)}
						</p>
					)}
				</>
			) : null}

			<ClubApplicationSubmitConfirmDialog
				open={confirmOpen}
				onOpenChange={(open) => {
					setConfirmOpen(open);
					if (!open) setSubmitBody(null);
				}}
				isUpdate={Boolean(pending)}
				busy={saveMut.isPending}
				onConfirm={() => {
					if (!submitBody) return;
					saveMut.mutate(
						{ applicationId: pending?.id ?? null, body: submitBody },
						{
							onSuccess: () => {
								toast.success(
									pending ? "Application updated." : "Application submitted.",
								);
								setConfirmOpen(false);
								setSubmitBody(null);
								void refetch();
								void router.push("/clubs");
							},
							onError: (e) => {
								toast.error(String(e.message));
							},
						},
					);
				}}
			/>
		</div>
	);
}
