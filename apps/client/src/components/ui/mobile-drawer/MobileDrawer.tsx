"use client";

import type { User as AuthUser } from "@supabase/supabase-js";
import { MoreVertical, User as UserIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/ui/logo/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle/ThemeToggle";
import { NAV_ITEMS } from "@/constants/nav";
import { useLogoutDialog } from "@/hooks/logoutDialogProvider";
import {
	avatarUrlFromAuthUser,
	displayNameFromAuthUser,
} from "@/lib/auth/supabase-user-display";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileDrawer } from "@/store/slices/uiSlice";

function MobileDrawerUserSection() {
	const dispatch = useAppDispatch();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = useMemo(() => createClient(), []);
	const { openDialog: openLogoutDialog } = useLogoutDialog();

	useEffect(() => {
		let cancelled = false;

		async function loadUser() {
			const { data } = await supabase.auth.getUser();
			if (!cancelled) {
				setUser(data.user ?? null);
				setLoading(false);
			}
		}

		void loadUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!cancelled) {
				setUser(session?.user ?? null);
			}
		});

		return () => {
			cancelled = true;
			subscription.unsubscribe();
		};
	}, [supabase]);

	const displayName = loading
		? "…"
		: user
			? displayNameFromAuthUser(user)
			: "Player";
	const avatarUrl = user ? avatarUrlFromAuthUser(user) : null;
	const profileHref = user ? `/profile/${user.id}` : "/profile";

	return (
		<div className="p-6 border-t border-border bg-bg-base">
			<div className="flex items-center gap-3 p-3 bg-bg-surface rounded-lg border border-border/30">
				<Link
					href={profileHref}
					onClick={() => dispatch(closeMobileDrawer())}
					className="flex min-w-0 flex-1 items-center gap-3"
				>
					<div className="relative shrink-0">
						<div className="relative w-10 h-10 rounded-full bg-bg-elevated border-2 border-accent overflow-hidden flex items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.3)]">
							{avatarUrl ? (
								<Image
									src={avatarUrl}
									alt=""
									fill
									className="object-cover"
									sizes="40px"
									unoptimized
								/>
							) : (
								<UserIcon
									size={18}
									strokeWidth={1.5}
									className="text-text-secondary"
								/>
							)}
						</div>
						<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-bg-base" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
						<span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
							{displayName}
						</span>
					</div>
				</Link>
				<button
					type="button"
					aria-label="Open account options"
					className="shrink-0 rounded-md p-2 text-text-disabled transition-colors duration-default hover:bg-bg-elevated hover:text-text-primary"
					onClick={() => {
						dispatch(closeMobileDrawer());
						openLogoutDialog();
					}}
				>
					<MoreVertical size={16} strokeWidth={1.5} />
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
