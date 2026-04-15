"use client";

import { cn } from "@/lib/utils";

type ChipOption<T extends string> = {
	v: T;
	label: string;
};

type ChipRowProps<T extends string> = {
	value: T | "";
	onChange: (value: T) => void;
	options: ChipOption<T>[];
};

export function ChipRow<T extends string>({
	value,
	onChange,
	options,
}: ChipRowProps<T>) {
	return (
		<div className="flex flex-col gap-3">
			{options.map((opt) => (
				<button
					key={opt.v}
					type="button"
					onClick={() => onChange(opt.v)}
					className={cn(
						"min-h-[44px] w-full rounded-lg border p-3 text-body transition-colors",
						value === opt.v
							? "border-accent bg-accent/10 text-accent"
							: "border-border bg-bg-surface text-text-primary",
					)}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
