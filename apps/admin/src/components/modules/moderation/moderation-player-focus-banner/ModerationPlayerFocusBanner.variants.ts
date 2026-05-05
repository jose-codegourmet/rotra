import { cva, type VariantProps } from "class-variance-authority";

export const moderationPlayerFocusBannerVariants = cva(
	"rounded-lg border px-4 py-3 text-small transition-colors duration-default",
	{
		variants: {
			tone: {
				default: "border-border bg-bg-elevated text-text-primary",
				accent: "border-accent/40 bg-accent-subtle text-text-primary",
			},
		},
		defaultVariants: {
			tone: "accent",
		},
	},
);

export type ModerationPlayerFocusBannerVariants = VariantProps<
	typeof moderationPlayerFocusBannerVariants
>;
