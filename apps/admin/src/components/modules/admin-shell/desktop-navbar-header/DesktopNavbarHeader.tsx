"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/modules/admin-shell/notifications-dropdown/NotificationsDropdown";
import { Button } from "@/components/ui/button/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/DropdownMenu";
import { ROUTES } from "@/constants/admin";
import type { Notification } from "@/constants/mock-notifications";
import { cn } from "@/lib/utils/tailwind";

export interface DesktopNavbarHeaderProps {
	pageTitle: string;
	adminName?: string;
	onRequestSignOut: () => void;
	notifications: Notification[];
	unreadCount: number;
}

function adminInitials(name: string | undefined): string {
	if (!name?.trim()) return "A";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "A";
	if (parts.length === 1) {
		const [only] = parts;
		return (only ?? "A").slice(0, 2).toUpperCase();
	}
	const first = parts[0]?.[0] ?? "";
	const last = parts[parts.length - 1]?.[0] ?? "";
	return `${first}${last}`.toUpperCase() || "A";
}

export function DesktopNavbarHeader({
	pageTitle,
	adminName,
	onRequestSignOut,
	notifications,
	unreadCount,
}: DesktopNavbarHeaderProps) {
	const displayName = adminName?.trim() || "Platform admin";
	const initials = adminInitials(adminName);

	return (
		<header className="sticky top-0 z-20 hidden min-h-16 items-center border-b border-border bg-bg-base px-6 py-3 md:flex">
			<h1 className="text-title text-text-primary">{pageTitle}</h1>
			<div className="ml-auto flex items-center gap-3">
				<NotificationsDropdown
					notifications={notifications}
					unreadCount={unreadCount}
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							className="h-auto min-h-11 gap-2 px-2 text-text-secondary hover:text-text-primary"
						>
							<span
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-full",
									"border border-border-strong bg-bg-elevated text-small font-medium text-accent",
								)}
								aria-hidden
							>
								{initials}
							</span>
							<span className="max-w-40 truncate text-small">
								{displayName}
							</span>
							<ChevronDown className="size-4 shrink-0" aria-hidden />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="min-w-44">
						<DropdownMenuItem asChild>
							<Link href={ROUTES.PROFILE} className="cursor-pointer">
								<User className="size-4" aria-hidden />
								My profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onSelect={(event) => {
								event.preventDefault();
								onRequestSignOut();
							}}
						>
							<LogOut className="size-4" aria-hidden />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

DesktopNavbarHeader.displayName = "DesktopNavbarHeader";
