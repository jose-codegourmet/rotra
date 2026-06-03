"use client";

import type { AdminRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { navItemIsActive } from "@/components/modules/admin-shell/admin-nav";
import { Logo } from "@/components/ui/logo/Logo";
import { ADMIN_APP_DISPLAY_NAME, ROUTES } from "@/constants/admin";
import { filterAdminNavItems } from "@/lib/admin-nav-items";
import { cn } from "@/lib/utils/tailwind";

export interface DesktopSidebarProps {
	pathname: string;
	adminRole: AdminRole;
}

function SidebarNavLink({
	href,
	label,
	Icon,
	active,
}: {
	href: string;
	label: string;
	Icon: LucideIcon;
	active: boolean;
}) {
	const className = cn(
		"flex min-h-11 w-full items-center gap-3 rounded-lg py-2 text-body transition-colors duration-default",
		"justify-center px-2 lg:justify-start lg:px-3",
		active
			? "bg-accent-subtle text-accent"
			: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
	);

	return (
		<Link href={href} className={className} aria-label={label}>
			<Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
			<span className="hidden lg:inline">{label}</span>
		</Link>
	);
}

export function DesktopSidebar({ pathname, adminRole }: DesktopSidebarProps) {
	const navItems = filterAdminNavItems(adminRole);

	return (
		<aside
			className="fixed left-0 top-0 z-30 hidden h-full w-20 flex-col border-r border-border border-l-2 border-l-accent bg-bg-surface md:flex lg:w-64"
			aria-label="Admin navigation"
		>
			<div className="flex flex-col gap-1 border-b border-border px-3 py-5 lg:px-4">
				<Link
					href={ROUTES.DASHBOARD}
					className="block min-h-11 min-w-11 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
				>
					<Logo variant="dark" className="w-full" />
				</Link>
				<p className="hidden text-label uppercase tracking-wider text-text-secondary lg:block">
					Internal
				</p>
				<p className="hidden text-micro uppercase tracking-widest text-text-disabled lg:block">
					{ADMIN_APP_DISPLAY_NAME}
				</p>
			</div>

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
				{navItems.map(({ label, href, icon: Icon }) => (
					<SidebarNavLink
						key={href}
						href={href}
						label={label}
						Icon={Icon}
						active={navItemIsActive(href, pathname)}
					/>
				))}
			</nav>
		</aside>
	);
}

DesktopSidebar.displayName = "DesktopSidebar";
