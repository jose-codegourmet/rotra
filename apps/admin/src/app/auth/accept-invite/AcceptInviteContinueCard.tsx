"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/Button";

type AcceptInviteContinueCardProps = {
	continueHref: string;
};

export function AcceptInviteContinueCard({
	continueHref,
}: AcceptInviteContinueCardProps) {
	const router = useRouter();

	return (
		<div className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-modal sm:p-8">
			<header className="space-y-2">
				<h2 className="text-title text-text-primary">Accept invitation</h2>
				<p className="text-body text-text-secondary">
					Continue to securely open your ROTRA Admin invite and set your
					password.
				</p>
			</header>

			<div className="mt-6">
				<Button
					type="button"
					variant="default"
					className="min-h-12 w-full shadow-accent"
					onClick={() => router.push(continueHref)}
				>
					Continue
				</Button>
			</div>
		</div>
	);
}

AcceptInviteContinueCard.displayName = "AcceptInviteContinueCard";
