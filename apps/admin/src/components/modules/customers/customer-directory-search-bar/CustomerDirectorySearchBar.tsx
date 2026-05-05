"use client";

import { Input } from "@/components/ui/input/Input";
import { cn } from "@/lib/utils";

export type CustomerDirectorySearchBarProps = {
	id?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
};

export function CustomerDirectorySearchBar({
	id = "customer-directory-search",
	value,
	onChange,
	placeholder = "Search by name or email…",
	className,
}: CustomerDirectorySearchBarProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
				className,
			)}
		>
			<label
				htmlFor={id}
				className="shrink-0 text-label uppercase tracking-wide text-text-secondary"
			>
				Search
			</label>
			<Input
				id={id}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				autoComplete="off"
				className="sm:max-w-md"
			/>
		</div>
	);
}

CustomerDirectorySearchBar.displayName = "CustomerDirectorySearchBar";
