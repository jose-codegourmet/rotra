"use client";

import type { AdminRole } from "@prisma/client";
import { Bell, LogOut, User, X } from "lucide-react";
import Link from "next/link";
import { navItemIsActive } from "@/components/modules/admin-shell/admin-nav";
import { Button } from "@/components/ui/button/Button";
import { Logo } from "@/components/ui/logo/Logo";
import { NotificationsBadge } from "@/components/ui/notifications-badge/NotificationsBadge";
import { ADMIN_APP_DISPLAY_NAME, ROUTES } from "@/constants/admin";
import { filterAdminNavItems } from "@/lib/admin-nav-items";
import { cn } from "@/lib/utils/tailwind";

export interface MobileSidebarProps {
	open: boolean;
	pathname: string;
	adminRole: AdminRole;
	adminName?: string;
	/** Unread count for the notifications nav row badge */
	unreadCount?: number;
	onClose: () => void;
	onRequestSignOut: () => void;
}

export function MobileSidebar({
	open,
	pathname,
	adminRole,
	adminName,
	unreadCount = 0,
	onClose,
	onRequestSignOut,
}: MobileSidebarProps) {
	const navItems = filterAdminNavItems(adminRole);
	const notificationsActive = navItemIsActive(ROUTES.NOTIFICATIONS, pathname);

	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-[60] flex w-72 flex-col bg-bg-surface md:hidden",
				"border-r border-border shadow-modal",
				"transform transition-transform duration-slow ease-in-out",
				open ? "translate-x-0" : "-translate-x-full",
			)}
			aria-label="Admin navigation menu"
			aria-hidden={!open}
		>
			<div className="flex items-center justify-between gap-3 border-b border-border p-4">
				<div className="min-w-0 flex-1">
					<Link
						href={ROUTES.DASHBOARD}
						onClick={onClose}
						className="block outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
					>
						<Logo variant="dark" className="w-full" />
					</Link>
					<p className="mt-2 text-micro uppercase tracking-widest text-text-disabled">
						{ADMIN_APP_DISPLAY_NAME}
					</p>
				</div>
				<button
					type="button"
					aria-label="Close navigation menu"
					className="shrink-0 rounded-full p-2 text-text-secondary transition-colors duration-default hover:bg-bg-elevated hover:text-text-primary"
					onClick={onClose}
				>
					<X className="size-5" strokeWidth={1.5} />
				</button>
			</div>

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
				{navItems.map(({ label, href, icon: Icon }) => {
					const active = navItemIsActive(href, pathname);
					return (
						<Link
							key={href}
							href={href}
							onClick={onClose}
							className={cn(
								"flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-default",
								active
									? "bg-accent-subtle text-accent"
									: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
							)}
						>
							<Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
							{label}
						</Link>
					);
				})}
				<Link
					href={ROUTES.NOTIFICATIONS}
					onClick={onClose}
					className={cn(
						"flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-default",
						notificationsActive
							? "bg-accent-subtle text-accent"
							: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
					)}
				>
					<Bell aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
					<span className="min-w-0 flex-1">Notifications</span>
					<NotificationsBadge count={unreadCount} size="md" />
				</Link>
			</nav>
			<div className="border-t border-border p-3">
				{adminName ? (
					<p className="mb-2 truncate px-3 text-small text-text-primary">
						{adminName}
					</p>
				) : null}
				<Link
					href={ROUTES.PROFILE}
					onClick={onClose}
					className={cn(
						"mb-1 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-default",
						navItemIsActive(ROUTES.PROFILE, pathname)
							? "bg-accent-subtle text-accent"
							: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
					)}
				>
					<User aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
					My profile
				</Link>
				<Button
					type="button"
					variant="ghost"
					className="w-full justify-start text-text-secondary hover:text-text-primary"
					onClick={onRequestSignOut}
				>
					<LogOut className="size-4" />
					Sign out
				</Button>
			</div>
		</aside>
	);
}

MobileSidebar.displayName = "MobileSidebar";
