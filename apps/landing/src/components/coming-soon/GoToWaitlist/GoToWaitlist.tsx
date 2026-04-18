"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

type GoToWaitlistProps = {
	children: React.ReactNode;
	className?: string;
};

export function GoToWaitlist({ children, className }: GoToWaitlistProps) {
	return (
		<Button
			variant="default"
			className={cn("min-h-[44px] min-w-[44px]", className)}
			size="lg"
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
		</Button>
	);
}
