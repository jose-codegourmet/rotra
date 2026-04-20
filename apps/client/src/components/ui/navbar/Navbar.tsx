"use client";

import { LogOut, Search, Settings } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle/ThemeToggle";
import { useLogoutDialog } from "@/hooks/logoutDialogProvider";

export interface NavbarProps {
	pageTitle?: string;
	pageSubtitle?: string;
}

export function Navbar({
	pageTitle = "Dashboard",
	pageSubtitle = "ROTRA",
}: NavbarProps) {
	const { openDialog: openLogoutDialog } = useLogoutDialog();

	return (
		<header className="hidden lg:flex fixed top-0 right-0 w-[calc(100%-256px)] h-16 items-center justify-between px-8 z-40 border-b border-border backdrop-blur-xl bg-bg-surface/80">
			{/* Left: breadcrumb */}
			<div className="flex items-center gap-4">
				<span className="text-label font-bold uppercase tracking-widest text-accent">
					{pageTitle}
				</span>
				<div className="h-4 w-px bg-border-strong" />
				<span className="text-label font-bold uppercase tracking-widest text-text-secondary">
					{pageSubtitle}
				</span>
			</div>

			{/* Right: actions */}
			<div className="flex items-center gap-6">
				<ThemeToggle />
				<button
					type="button"
					className="text-text-disabled hover:text-accent transition-colors duration-default"
					aria-label="Search"
				>
					<Search size={20} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					className="text-text-disabled hover:text-accent transition-colors duration-default"
					aria-label="Settings"
				>
					<Settings size={20} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					className="text-text-disabled hover:text-accent transition-colors duration-default"
					aria-label="Log out"
					onClick={() => {
						openLogoutDialog();
					}}
				>
					<LogOut size={20} strokeWidth={1.5} />
				</button>
			</div>
		</header>
	);
}
