"use client";

import { Menu, User } from "lucide-react";

export interface MobileNavbarHeaderProps {
	pageTitle: string;
	onOpenMenu: () => void;
}

export function MobileNavbarHeader({
	pageTitle,
	onOpenMenu,
}: MobileNavbarHeaderProps) {
	return (
		<header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-bg-base/80 px-4 backdrop-blur-xl md:hidden">
			<button
				type="button"
				aria-label="Open navigation menu"
				className="shrink-0 text-accent transition-transform active:scale-95"
				onClick={onOpenMenu}
			>
				<Menu className="size-6" strokeWidth={1.5} />
			</button>
			<p className="min-w-0 flex-1 truncate text-center text-small font-bold uppercase tracking-wide text-text-primary">
				{pageTitle}
			</p>
			<span
				className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-text-secondary"
				aria-hidden
			>
				<User className="size-5" strokeWidth={1.5} />
			</span>
		</header>
	);
}

MobileNavbarHeader.displayName = "MobileNavbarHeader";
