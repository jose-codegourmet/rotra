"use client";

import { ChevronRight, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickSessionButtonProps {
	disabled?: boolean;
	variant?: "create" | "resume";
	onClick: () => void;
	className?: string;
}

export function QuickSessionButton({
	disabled = false,
	variant = "create",
	onClick,
	className,
}: QuickSessionButtonProps) {
	const isResume = variant === "resume";

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"pointer-events-auto group absolute bottom-10 left-10 z-30",
				"flex items-center gap-3 rounded-full border border-accent/20",
				"bg-bg-surface pr-4 pl-1 py-1",
				"shadow-[0_0_40px_rgba(0,255,136,0.15)]",
				"transition-all duration-300",
				"hover:bg-accent hover:pr-8",
				"disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			aria-label={
				isResume ? "Resume your active session" : "Start a quick session"
			}
		>
			<span
				className={cn(
					"flex size-14 shrink-0 items-center justify-center rounded-full",
					"bg-gradient-to-br from-accent to-accent-dim text-bg-base",
					"group-hover:from-bg-base group-hover:to-bg-base group-hover:text-accent",
				)}
			>
				{isResume ? (
					<Play className="size-6" strokeWidth={2.5} aria-hidden="true" />
				) : (
					<Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
				)}
			</span>
			<span className="flex min-w-0 flex-col items-start text-left">
				<span
					className={cn(
						"text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dim",
						"group-hover:text-bg-base/80",
					)}
				>
					{isResume ? "ACTIVE SESSION" : "SCHEDULE SESSION"}
				</span>
				<span
					className={cn(
						"text-sm font-black tracking-tight text-text-primary",
						"group-hover:text-bg-base",
					)}
				>
					{isResume ? "RESUME SESSION" : "START QUICK SESSION"}
				</span>
			</span>
			<ChevronRight
				className={cn(
					"size-4 shrink-0 text-bg-base opacity-0 transition-opacity duration-300",
					"group-hover:opacity-100",
				)}
				aria-hidden="true"
			/>
		</button>
	);
}
