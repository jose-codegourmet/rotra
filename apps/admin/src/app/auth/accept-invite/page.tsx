import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAuthBackgroundLayout } from "@/components/modules/login/AdminAuthBackgroundLayout/AdminAuthBackgroundLayout";
import { AcceptInviteContinueCard } from "./AcceptInviteContinueCard";

export const metadata: Metadata = {
	title: "Accept Invite — ROTRA Admin",
};

type AcceptInviteSearchParams = {
	token_hash?: string;
	type?: string;
	next?: string;
};

function getSafeNextPath(rawNext: string | undefined): string {
	if (!rawNext) return "/set-password";
	if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
		return "/set-password";
	}
	return rawNext;
}

export default async function AcceptInvitePage({
	searchParams,
}: {
	searchParams: Promise<AcceptInviteSearchParams>;
}) {
	const params = await searchParams;
	const tokenHash = params.token_hash?.trim();
	const type = params.type?.trim();
	const nextPath = getSafeNextPath(params.next);

	if (!tokenHash || type !== "invite") {
		redirect("/login?error=invite_invalid");
	}

	const callbackParams = new URLSearchParams({
		token_hash: tokenHash,
		type,
		next: nextPath,
	});
	const continueHref = `/auth/callback?${callbackParams.toString()}`;

	return (
		<AdminAuthBackgroundLayout tagline="Internal platform operations">
			<AcceptInviteContinueCard continueHref={continueHref} />
		</AdminAuthBackgroundLayout>
	);
}
