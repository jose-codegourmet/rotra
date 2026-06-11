import { cva, type VariantProps } from "class-variance-authority";

export const placeStatusBadgeVariants = cva(
	"inline-flex items-center rounded-full px-2 py-0.5 text-micro font-medium uppercase tracking-widest",
	{
		variants: {
			status: {
				confirmed: "border border-accent/40 bg-accent-subtle text-accent",
				unreviewed: "border border-warning/40 bg-warning/10 text-warning",
			},
		},
		defaultVariants: { status: "unreviewed" },
	},
);

export type PlaceStatusBadgeVariants = VariantProps<
	typeof placeStatusBadgeVariants
>;
