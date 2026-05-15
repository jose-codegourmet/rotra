"use client";

import { cn } from "@/lib/utils/tailwind";

export interface MobileNavBackdropProps {
	open: boolean;
	onDismiss: () => void;
}

export function MobileNavBackdrop({ open, onDismiss }: MobileNavBackdropProps) {
	return (
		<div
			className={cn(
				"fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-slow md:hidden",
				open
					? "pointer-events-auto opacity-100"
					: "pointer-events-none opacity-0",
			)}
			onClick={onDismiss}
			aria-hidden="true"
		/>
	);
}

MobileNavBackdrop.displayName = "MobileNavBackdrop";
