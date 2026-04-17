import { AtSign, MessageCircle, MessagesSquare } from "lucide-react";
import Link from "next/link";

import {
	communitySection,
	socialPlaceholders,
} from "@/app/constants/coming-soon";
import { cn } from "@/lib/utils";

const socialIcons = [AtSign, MessageCircle, MessagesSquare] as const;

export function CommunityBand() {
	return (
		<section
			className="border-t border-border bg-bg-surface/40 px-4 py-16 md:px-6 md:py-20"
			aria-labelledby="community-title"
		>
			<div className="mx-auto max-w-[720px] text-center">
				<p className="text-label uppercase tracking-widest text-accent">
					{communitySection.eyebrow}
				</p>
				<h2
					id="community-title"
					className="mt-3 text-title text-2xl font-semibold tracking-tight text-text-primary md:text-3xl"
				>
					{communitySection.title}
				</h2>
				<p className="mt-4 text-body text-text-secondary">
					{communitySection.body}
				</p>
				<div className="mt-8 flex justify-center gap-4">
					{socialPlaceholders.map((s, i) => {
						const Icon = socialIcons[i] ?? MessagesSquare;
						return (
							<Link
								key={s.name}
								href={s.href}
								className={cn(
									"flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-bg-elevated text-text-primary transition-colors",
									"hover:border-border-strong hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
								)}
								aria-label={s.name}
							>
								<Icon className="size-5" strokeWidth={1.5} aria-hidden />
							</Link>
						);
					})}
				</div>
				<div className="mt-10 flex flex-wrap justify-center gap-3">
					{communitySection.statusChips.map((chip) => (
						<Link
							key={chip.label}
							href={chip.href}
							className="min-h-[44px] min-w-[44px] rounded-full border border-accent px-4 py-2 text-label uppercase tracking-wide text-text-primary transition-colors hover:bg-bg-elevated"
						>
							{chip.label}
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
