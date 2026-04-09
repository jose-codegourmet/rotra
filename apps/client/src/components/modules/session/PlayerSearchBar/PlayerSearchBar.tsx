"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

export interface PlayerSearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onFilterClick?: () => void;
	placeholder?: string;
	className?: string;
}

export function PlayerSearchBar({
	value,
	onChange,
	onFilterClick,
	placeholder = "Search…",
	className,
}: PlayerSearchBarProps) {
	return (
		<div className={cn("flex gap-2 w-full", className)}>
			<label className="relative flex-1 min-w-0">
				<span className="sr-only">Search players</span>
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-disabled pointer-events-none"
					strokeWidth={2}
				/>
				<input
					type="search"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className={cn(
						"w-full h-10 pl-10 pr-3 rounded-md bg-bg-surface border border-border",
						"text-small text-text-primary placeholder:text-text-disabled",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
					)}
				/>
			</label>
			<Button
				type="button"
				variant="outline"
				className="shrink-0 uppercase text-label font-bold tracking-widest gap-2"
				onClick={onFilterClick}
			>
				<Filter className="size-4" />
				Filter
			</Button>
		</div>
	);
}
