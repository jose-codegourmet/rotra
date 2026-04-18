import type { Meta, StoryObj } from "@storybook/nextjs";

import { LandingNav } from "./LandingNav";

const meta = {
	title: "ComingSoon/LandingNav",
	component: LandingNav,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof LandingNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Bottom CTA strip + full-width logo — verify below md breakpoint */
export const MobileViewport: Story = {
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
