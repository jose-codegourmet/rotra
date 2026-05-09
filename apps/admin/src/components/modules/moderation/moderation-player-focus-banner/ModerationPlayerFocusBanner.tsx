import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import {
	type ModerationPlayerFocusBannerVariants,
	moderationPlayerFocusBannerVariants,
} from "./ModerationPlayerFocusBanner.variants";

export type ModerationPlayerFocusBannerProps = HTMLAttributes<HTMLDivElement> &
	ModerationPlayerFocusBannerVariants & {
		playerId: string;
		tab?: string | null;
	};

export function ModerationPlayerFocusBanner({
	className,
	tone,
	playerId,
	tab,
	...props
}: ModerationPlayerFocusBannerProps) {
	const tabLabel = tab === "accounts" ? "Accounts" : tab ? tab : null;

	return (
		<div
			role="status"
			className={cn(moderationPlayerFocusBannerVariants({ tone }), className)}
			{...props}
		>
			<p className="font-medium text-text-primary">
				Focused player
				{tabLabel ? (
					<span className="text-text-secondary"> · {tabLabel} tab</span>
				) : null}
			</p>
			<p className="mt-1 break-all font-mono text-micro text-text-secondary">
				{playerId}
			</p>
			<p className="mt-2 text-micro text-text-secondary">
				Full account moderation tooling will tie into this queue in a later
				release.
			</p>
		</div>
	);
}

ModerationPlayerFocusBanner.displayName = "ModerationPlayerFocusBanner";
