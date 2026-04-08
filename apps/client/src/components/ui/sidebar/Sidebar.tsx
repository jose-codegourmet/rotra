"use client";

import { MoreVertical, Plus, User } from "lucide-react";
import { NAV_ITEMS, type NavItemId } from "@/app/constants/nav";
import { Logo } from "@/components/ui/logo/Logo";
import { cn } from "@/lib/utils";

export type { NavItemId };

export interface SidebarProps {
	activeItem?: NavItemId;
}

export function Sidebar({ activeItem = "home" }: SidebarProps) {
	return (
		<aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-20 lg:w-64 bg-bg-base border-r border-border z-50 py-8">
			{/* Logo */}
			<div className="px-5 mb-10">
				<Logo variant="dark" className="w-8 lg:w-36" />
			</div>

			{/* Nav items */}
			<nav className="flex-1 space-y-1">
				{NAV_ITEMS.map(({ id, label, Icon }) => {
					const isActive = activeItem === id;
					return (
						<button
							key={id}
							type="button"
							className={cn(
								"w-full flex items-center px-6 py-4 transition-all duration-default",
								isActive
									? "text-accent border-r-2 border-accent bg-gradient-to-r from-accent/10 to-transparent"
									: "text-text-disabled hover:bg-bg-elevated hover:text-text-primary",
							)}
						>
							<Icon size={20} strokeWidth={1.5} className="shrink-0 lg:mr-4" />
							<span className="hidden lg:block text-label font-medium uppercase tracking-widest">
								{label}
							</span>
						</button>
					);
				})}
			</nav>

			{/* CTA button */}
			<div className="px-4 mb-6">
				<button
					type="button"
					className="w-full h-12 flex items-center justify-center rounded-md bg-gradient-to-br from-[#f1ffef] to-accent text-bg-base font-black transition-transform active:scale-95 shadow-accent"
				>
					<Plus size={20} strokeWidth={2} className="lg:hidden shrink-0" />
					<span className="hidden lg:block text-micro font-black uppercase tracking-widest">
						New Session
					</span>
				</button>
			</div>

			{/* User section */}
			<div className="mt-auto pt-6 border-t border-border px-4">
				<div className="flex items-center gap-3 lg:bg-bg-surface lg:p-3 rounded-lg transition-colors hover:bg-bg-elevated cursor-pointer group">
					<div className="relative shrink-0">
						<div className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-accent flex items-center justify-center group-hover:scale-105 transition-transform">
							<User
								size={18}
								strokeWidth={1.5}
								className="text-text-secondary"
							/>
						</div>
						<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-bg-base" />
					</div>
					<div className="hidden lg:flex flex-col overflow-hidden">
						<span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
							Alex Santos
						</span>
						<span className="text-micro font-bold text-accent uppercase tracking-tight">
							Warrior 2
						</span>
					</div>
					<MoreVertical
						size={16}
						strokeWidth={1.5}
						className="hidden lg:block ml-auto text-text-disabled"
					/>
				</div>
			</div>
		</aside>
	);
}
