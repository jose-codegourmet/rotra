"use client";

import { LogOutIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";
import { useLogoutDialog } from "@/hooks/logoutDialogProvider";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileDrawer } from "@/store/slices/uiSlice";
import { SmallUserCard } from "../small-user-card/SmallUserCard";

function MobileDrawerUserSection() {
	const dispatch = useAppDispatch();
	const user = useAppSelector((s) => s.auth.user);
	const initialized = useAppSelector((s) => s.auth.initialized);
	const loading = !initialized;
	const { openDialog: openLogoutDialog } = useLogoutDialog();

	return (
		<div className="p-6 border-t border-border bg-bg-base">
			<div className="flex items-center gap-3 p-3 bg-bg-surface rounded-lg border border-border/30">
				{user && (
					<SmallUserCard
						user={user}
						isOwner={true}
						loading={loading}
						isMobile
						onAvatarClick={() => dispatch(closeMobileDrawer())}
					/>
				)}

				<button
					type="button"
					aria-label="Open account options"
					className="shrink-0 rounded-md p-2 text-text-disabled transition-colors duration-default hover:bg-bg-elevated hover:text-text-primary ml-auto"
					onClick={() => {
						dispatch(closeMobileDrawer());
						openLogoutDialog();
					}}
				>
					<LogOutIcon size={16} strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}

export function MobileDrawer() {
	const pathname = usePathname();
	const activeItem =
		NAV_ITEMS.find(
			(item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
		)?.id ?? "home";
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) => state.ui.isMobileDrawerOpen);

	return (
		<>
			{/* Backdrop overlay */}
			<div
				className={cn(
					"fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-slow",
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none",
				)}
				onClick={() => dispatch(closeMobileDrawer())}
				aria-hidden="true"
			/>

			{/* Drawer panel */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-[60] w-72 bg-bg-base flex flex-col md:hidden",
					"border-r border-border shadow-modal",
					"transform transition-transform duration-slow ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
				aria-label="Navigation menu"
			>
				{/* Header */}
				<div className="p-6 flex justify-between items-center border-b border-border">
					<div className="flex items-center gap-2 w-full">
						<Logo variant="dark" className="w-full" />
					</div>
					<button
						type="button"
						aria-label="Close navigation menu"
						className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors duration-default"
						onClick={() => dispatch(closeMobileDrawer())}
					>
						<X size={20} strokeWidth={1.5} />
					</button>
				</div>

				{/* Nav items */}
				<nav className="flex-1 py-4">
					{NAV_ITEMS.map(({ id, label, Icon, href }) => {
						const isActive = activeItem === id;
						return (
							<Link
								key={id}
								href={href}
								onClick={() => dispatch(closeMobileDrawer())}
								className={cn(
									"w-full flex items-center px-6 py-4 transition-colors duration-default",
									isActive
										? "text-accent bg-accent/10 border-r-4 border-accent"
										: "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
								)}
							>
								<Icon
									size={20}
									strokeWidth={isActive ? 2 : 1.5}
									className="mr-4 shrink-0"
								/>
								<span
									className={cn(
										"text-label uppercase tracking-widest",
										isActive ? "font-bold" : "font-medium",
									)}
								>
									{label}
								</span>
							</Link>
						);
					})}

					{/* Theme toggle */}
					<ThemeToggle variant="row" />
				</nav>

				<MobileDrawerUserSection />
			</aside>
		</>
	);
}
