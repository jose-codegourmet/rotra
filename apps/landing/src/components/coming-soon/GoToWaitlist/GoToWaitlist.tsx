"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

type GoToWaitlistProps = {
	children: React.ReactNode;
	className?: string;
};

export function GoToWaitlist({ children, className }: GoToWaitlistProps) {
	return (
		<button
			type="button"
			className={cn("min-h-[44px] min-w-[44px]", className)}
			onClick={() => {
				document.getElementById("waitlist")?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
				window.setTimeout(() => {
					document.getElementById("waitlist-email")?.focus();
				}, 400);
			}}
		>
			{children}
		</button>
	);
}
