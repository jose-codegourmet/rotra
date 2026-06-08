import { cva } from "class-variance-authority";

export const sessionDiscoveryCardVariants = cva(
	"flex flex-col gap-3 rounded-xl bg-bg-elevated p-4 transition-colors",
	{
		variants: {
			variant: {
				compact: "w-full",
				list: "flex-row items-center justify-between gap-4",
				grid: "h-full",
			},
		},
		defaultVariants: {
			variant: "grid",
		},
	},
);
