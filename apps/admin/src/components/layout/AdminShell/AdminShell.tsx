"use client";

import type { LucideIcon } from "lucide-react";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo/Logo";
import {
	ADMIN_APP_DISPLAY_NAME,
	ADMIN_NAV_ITEMS,
	getAdminShellPageTitle,
	ROUTES,
} from "@/constants/admin";
import { cn } from "@/lib/utils";

export interface AdminShellProps {
	children: React.ReactNode;
	/** When set (e.g. Storybook), overrides the title derived from the URL. */
	pageTitle?: string;
}

function NavRow({
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
		"flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-default",
		active
			? "bg-accent-subtle text-accent"
			: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
	);

	return (
		<Link href={href} className={className}>
			<Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
			{label}
		</Link>
	);
}

export function AdminShell({
	children,
	pageTitle: pageTitleOverride,
}: AdminShellProps) {
	const pathname = usePathname();
	const derivedTitle = getAdminShellPageTitle(pathname);
	const pageTitle = pageTitleOverride ?? derivedTitle;

	return (
		<div className="min-h-screen bg-bg-base">
			<aside
				className="fixed left-0 top-0 z-30 flex h-full w-56 flex-col border-r border-border border-l-2 border-l-accent bg-bg-surface lg:w-64"
				aria-label="Admin navigation"
			>
				<div className="flex flex-col gap-1 border-b border-border px-4 py-5">
					<Link
						href={ROUTES.DASHBOARD}
						className="block min-h-11 min-w-11 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
					>
						<Logo variant="dark" className="w-full" />
					</Link>
					<p className="text-label uppercase tracking-wider text-text-secondary">
						Internal
					</p>
					<p className="text-micro uppercase tracking-widest text-text-disabled">
						{ADMIN_APP_DISPLAY_NAME}
					</p>
				</div>

				<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
					{ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
						<NavRow
							key={href}
							href={href}
							label={label}
							Icon={Icon}
							active={
								href === ROUTES.USERS
									? pathname === href || pathname.startsWith(`${ROUTES.USERS}/`)
									: pathname === href
							}
						/>
					))}
				</nav>
			</aside>

			<div className="flex min-h-screen flex-col pl-56 lg:pl-64">
				<header className="sticky top-0 z-20 flex min-h-16 items-center border-b border-border bg-bg-base px-6 py-3">
					<h1 className="text-title text-text-primary">{pageTitle}</h1>
					<div className="ml-auto flex items-center gap-3">
						<span className="text-small text-text-secondary">
							Platform admin
						</span>
						<span
							className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-text-secondary"
							aria-hidden
						>
							<User className="size-5" strokeWidth={1.5} />
						</span>
					</div>
				</header>
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}

AdminShell.displayName = "AdminShell";
