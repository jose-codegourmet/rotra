"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

export type CustomerDetailActionsProps = {
	moderationHref: string;
	clientProfileUrl: string | null;
	className?: string;
};

export function CustomerDetailActions({
	moderationHref,
	clientProfileUrl,
	className,
}: CustomerDetailActionsProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
				className,
			)}
		>
			<Button type="button" variant="default" asChild>
				<Link href={moderationHref}>Take action</Link>
			</Button>
			{clientProfileUrl ? (
				<Button type="button" variant="outline" asChild>
					<a href={clientProfileUrl} target="_blank" rel="noopener noreferrer">
						Open in Client App
					</a>
				</Button>
			) : (
				<p className="text-small text-text-secondary">
					Client app URL not configured (set NEXT_PUBLIC_CLIENT_APP_ORIGIN).
				</p>
			)}
		</div>
	);
}

CustomerDetailActions.displayName = "CustomerDetailActions";
