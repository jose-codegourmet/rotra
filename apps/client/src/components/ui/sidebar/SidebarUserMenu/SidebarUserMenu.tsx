"use client";

import { LogOut, MoreVertical, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useLogoutDialog } from "@/hooks/logoutDialogProvider";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { SmallUserCard } from "../../small-user-card/SmallUserCard";

export function SidebarUserMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const user = useAppSelector((s) => s.auth.user);
	const containerRef = useRef<HTMLDivElement>(null);
	const { openDialog: openLogoutDialog } = useLogoutDialog();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const profileHref = user ? `/profile/${user.id}` : "/profile";

	return (
		<div
			className="mt-auto pt-6 border-t border-border px-4"
			ref={containerRef}
		>
			<div className="relative">
				{/* Popup menu */}
				{isOpen && (
					<div className="absolute bottom-full left-0 mb-2 w-full bg-bg-surface border border-border rounded-lg shadow-modal overflow-hidden z-10">
						<Link
							href={profileHref}
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-3 px-4 min-h-[44px] text-small font-bold text-text-primary hover:bg-bg-elevated transition-colors duration-default uppercase tracking-widest"
						>
							<UserCircle
								size={16}
								strokeWidth={1.5}
								className="shrink-0 text-text-secondary"
							/>
							Profile
						</Link>
						<div className="h-px bg-border" />
						<button
							type="button"
							className="w-full flex items-center gap-3 px-4 min-h-[44px] text-small font-bold text-error hover:bg-bg-elevated transition-colors duration-default uppercase tracking-widest"
							onClick={() => {
								setIsOpen(false);
								openLogoutDialog();
							}}
						>
							<LogOut size={16} strokeWidth={1.5} className="shrink-0" />
							Log Out
						</button>
					</div>
				)}

				{/* User row trigger */}
				{user && (
					<button
						type="button"
						aria-label="Open user menu"
						aria-expanded={isOpen}
						onClick={() => setIsOpen((prev) => !prev)}
						className="w-full flex items-center gap-3 lg:bg-bg-surface lg:p-3 rounded-lg transition-colors duration-default hover:bg-bg-elevated cursor-pointer group min-h-[44px]"
					>
						<SmallUserCard user={user} isOwner={true} />

						<MoreVertical
							size={16}
							strokeWidth={1.5}
							className={cn(
								"hidden lg:block ml-auto text-text-disabled transition-transform duration-default",
								isOpen && "rotate-90",
							)}
						/>
					</button>
				)}
			</div>
		</div>
	);
}
