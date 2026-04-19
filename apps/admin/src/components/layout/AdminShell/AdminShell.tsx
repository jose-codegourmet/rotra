"use client";

import type { LucideIcon } from "lucide-react";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

function navItemIsActive(href: string, pathname: string): boolean {
	if (href === ROUTES.USERS) {
		return pathname === href || pathname.startsWith(`${ROUTES.USERS}/`);
	}
	return pathname === href;
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

export function AdminShell({
	children,
	pageTitle: pageTitleOverride,
}: AdminShellProps) {
	const pathname = usePathname();
	const derivedTitle = getAdminShellPageTitle(pathname);
	const pageTitle = pageTitleOverride ?? derivedTitle;
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	return (
		<div className="min-h-screen bg-bg-base">
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
					{ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
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

			<div
				className={cn(
					"fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-slow md:hidden",
					mobileNavOpen
						? "pointer-events-auto opacity-100"
						: "pointer-events-none opacity-0",
				)}
				onClick={() => setMobileNavOpen(false)}
				aria-hidden="true"
			/>

			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-[60] flex w-72 flex-col bg-bg-surface md:hidden",
					"border-r border-border shadow-modal",
					"transform transition-transform duration-slow ease-in-out",
					mobileNavOpen ? "translate-x-0" : "-translate-x-full",
				)}
				aria-label="Admin navigation menu"
				aria-hidden={!mobileNavOpen}
			>
				<div className="flex items-center justify-between gap-3 border-b border-border p-4">
					<div className="min-w-0 flex-1">
						<Link
							href={ROUTES.DASHBOARD}
							onClick={() => setMobileNavOpen(false)}
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
						onClick={() => setMobileNavOpen(false)}
					>
						<X className="size-5" strokeWidth={1.5} />
					</button>
				</div>

				<nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
					{ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
						const active = navItemIsActive(href, pathname);
						return (
							<Link
								key={href}
								href={href}
								onClick={() => setMobileNavOpen(false)}
								className={cn(
									"flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-body transition-colors duration-default",
									active
										? "bg-accent-subtle text-accent"
										: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
								)}
							>
								<Icon
									aria-hidden
									className="size-5 shrink-0"
									strokeWidth={1.5}
								/>
								{label}
							</Link>
						);
					})}
				</nav>
			</aside>

			<header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between gap-3 border-b border-border bg-bg-base/80 px-4 backdrop-blur-xl md:hidden">
				<button
					type="button"
					aria-label="Open navigation menu"
					className="shrink-0 text-accent transition-transform active:scale-95"
					onClick={() => setMobileNavOpen(true)}
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

			<div className="flex min-h-screen flex-col pt-16 md:ml-20 md:pt-0 lg:ml-64">
				<header className="sticky top-0 z-20 hidden min-h-16 items-center border-b border-border bg-bg-base px-6 py-3 md:flex">
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
				<main className="flex-1 p-4 md:p-6">{children}</main>
			</div>
		</div>
	);
}

AdminShell.displayName = "AdminShell";
