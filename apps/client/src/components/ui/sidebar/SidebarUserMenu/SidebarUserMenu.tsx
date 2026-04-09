"use client";

import { LogOut, MoreVertical, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function SidebarUserMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

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
							href="/profile/u1"
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
							}}
						>
							<LogOut size={16} strokeWidth={1.5} className="shrink-0" />
							Log Out
						</button>
					</div>
				)}

				{/* User row trigger */}
				<button
					type="button"
					aria-label="Open user menu"
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
					className="w-full flex items-center gap-3 lg:bg-bg-surface lg:p-3 rounded-lg transition-colors duration-default hover:bg-bg-elevated cursor-pointer group min-h-[44px]"
				>
					{/* Avatar */}
					<div className="relative shrink-0">
						<div className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-default">
							<User
								size={18}
								strokeWidth={1.5}
								className="text-text-secondary"
							/>
						</div>
						<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-bg-base" />
					</div>

					{/* Name + tier */}
					<div className="hidden lg:flex flex-col overflow-hidden flex-1 text-left">
						<span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
							Alex Santos
						</span>
						<span className="text-micro font-bold text-accent uppercase tracking-tight">
							Warrior 2
						</span>
					</div>

					{/* Chevron indicator */}
					<MoreVertical
						size={16}
						strokeWidth={1.5}
						className={cn(
							"hidden lg:block ml-auto text-text-disabled transition-transform duration-default",
							isOpen && "rotate-90",
						)}
					/>
				</button>
			</div>
		</div>
	);
}
