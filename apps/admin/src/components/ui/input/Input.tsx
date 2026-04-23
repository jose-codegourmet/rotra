import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary outline-none transition-colors placeholder:text-text-disabled",
				"focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
				"aria-invalid:border-error aria-invalid:ring-1 aria-invalid:ring-error/40",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
