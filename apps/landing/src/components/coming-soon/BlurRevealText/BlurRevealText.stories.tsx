import type { Meta, StoryObj } from "@storybook/nextjs";

import { BlurRevealText } from "./BlurRevealText";

const meta = {
	title: "ComingSoon/BlurRevealText",
	component: BlurRevealText,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof BlurRevealText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlainString: Story = {
	args: {
		children: "Queue. Play. Track.",
		className: "font-semibold text-2xl text-text-primary",
	},
};

export const SegmentedAccent: Story = {
	args: {
		segments: [
			{ text: "Queue. Play." },
			{ text: "Track.", className: "text-accent" },
		],
		className: "font-semibold text-2xl text-text-primary",
	},
};
