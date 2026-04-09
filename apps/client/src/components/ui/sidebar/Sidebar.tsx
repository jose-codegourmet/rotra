"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo/Logo";
import { SidebarUserMenu } from "@/components/ui/sidebar/SidebarUserMenu/SidebarUserMenu";
import { NAV_ITEMS, type NavItemId } from "@/constants/nav";
import { cn } from "@/lib/utils";

export type { NavItemId };

export function Sidebar() {
	const pathname = usePathname();
	const activeItem =
		NAV_ITEMS.find(
			(item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
		)?.id ?? "home";
	return (
		<aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-20 lg:w-64 bg-bg-base border-r border-border z-50 py-8">
			{/* Logo */}
			<div className="px-5 mb-10">
				<Logo variant="dark" className="w-full" />
			</div>

			{/* Nav items */}
			<nav className="flex-1 space-y-1">
				{NAV_ITEMS.map(({ id, label, Icon, href }) => {
					const isActive = activeItem === id;
					return (
						<Link
							key={id}
							href={href}
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
						</Link>
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
			<SidebarUserMenu />
		</aside>
	);
}
