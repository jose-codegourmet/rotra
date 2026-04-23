"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
	{ href: "/approvals/club-applications", label: "Club applications" },
	{ href: "/approvals/demotions", label: "Demotions" },
] as const;

export function ApprovalsTabs() {
	const pathname = usePathname();

	return (
		<nav
			className="flex flex-wrap gap-1 border-b border-border pb-0"
			aria-label="Approvals sections"
		>
			{tabs.map((tab) => {
				const active =
					pathname === tab.href || pathname.startsWith(`${tab.href}/`);
				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={cn(
							"px-4 py-2.5 text-small font-bold uppercase tracking-widest rounded-t-md border border-transparent -mb-px transition-colors",
							active
								? "text-accent border-border border-b-bg-base bg-bg-base"
								: "text-text-secondary hover:text-text-primary border-b-transparent",
						)}
					>
						{tab.label}
					</Link>
				);
			})}
		</nav>
	);
}
