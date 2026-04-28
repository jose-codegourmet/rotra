import { cva, type VariantProps } from "class-variance-authority";

export const switchVariants = cva(
	"peer inline-flex shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs transition-all duration-default outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
	{
		variants: {
			size: {
				default: "h-5 w-9 p-0.5",
				sm: "h-4 w-8 p-0.5",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export const switchThumbVariants = cva(
	"pointer-events-none block rounded-full bg-primary-foreground ring-0 transition-transform duration-default data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
	{
		variants: {
			size: {
				default: "size-4",
				sm: "size-3",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export type SwitchVariants = VariantProps<typeof switchVariants>;
