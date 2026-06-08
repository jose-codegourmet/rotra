import { cva } from "class-variance-authority";

export const sessionMapPinVariants = cva(
	"flex items-center justify-center rounded-full border-4 border-bg-base transition-transform",
	{
		variants: {
			variant: {
				live: "size-10 bg-accent text-bg-base shadow-[0_0_8px_rgba(0,255,136,0.6)]",
				open: "size-8 bg-bg-elevated text-text-secondary",
				selected: "scale-110",
			},
		},
		defaultVariants: {
			variant: "open",
		},
	},
);
