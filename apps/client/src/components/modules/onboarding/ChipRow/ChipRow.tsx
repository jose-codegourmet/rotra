"use client";

import { cn } from "@/lib/utils";

export type ChipOption = {
	v: string;
	label: string;
};

type ChipRowProps = {
	value: string;
	onChange: (value: string) => void;
	options: ChipOption[];
};

export function ChipRow({ value, onChange, options }: ChipRowProps) {
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
