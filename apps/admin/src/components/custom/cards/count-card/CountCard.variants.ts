import { cva, type VariantProps } from "class-variance-authority";

export const countCardShellVariants = cva(
	"rounded-lg border border-border bg-bg-surface",
	{
		variants: {
			layout: {
				compact: "px-4 py-3",
				kpi: "p-5 shadow-card",
				attention: "p-4",
			},
		},
		defaultVariants: {
			layout: "compact",
		},
	},
);

export const countCardValueVariants = cva("", {
	variants: {
		layout: {
			compact: "mt-1 text-heading",
			kpi: "mt-2 text-display",
			attention: "mt-2 text-title",
		},
		tone: {
			primary: "text-text-primary",
			accent: "text-accent",
			muted: "text-text-secondary",
			warning: "text-warning",
		},
	},
	defaultVariants: {
		layout: "compact",
		tone: "primary",
	},
});

export type CountCardShellVariants = VariantProps<
	typeof countCardShellVariants
>;
export type CountCardValueVariants = VariantProps<
	typeof countCardValueVariants
>;
