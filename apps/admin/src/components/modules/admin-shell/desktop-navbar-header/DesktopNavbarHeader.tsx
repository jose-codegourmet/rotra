"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button/Button";

export interface DesktopNavbarHeaderProps {
	pageTitle: string;
	onRequestSignOut: () => void;
}

export function DesktopNavbarHeader({
	pageTitle,
	onRequestSignOut,
}: DesktopNavbarHeaderProps) {
	return (
		<header className="sticky top-0 z-20 hidden min-h-16 items-center border-b border-border bg-bg-base px-6 py-3 md:flex">
			<h1 className="text-title text-text-primary">{pageTitle}</h1>
			<div className="ml-auto flex items-center gap-3">
				<span className="text-small text-text-secondary">Platform admin</span>
				<span
					className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-text-secondary"
					aria-hidden
				>
					<User className="size-5" strokeWidth={1.5} />
				</span>
				<Button type="button" variant="outline" onClick={onRequestSignOut}>
					<LogOut className="size-4" />
					Sign out
				</Button>
			</div>
		</header>
	);
}

DesktopNavbarHeader.displayName = "DesktopNavbarHeader";
