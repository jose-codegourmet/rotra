import type { Meta, StoryObj } from "@storybook/nextjs";

import { LandingFooter } from "./LandingFooter";

const meta = {
	title: "ComingSoon/LandingFooter",
	component: LandingFooter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof LandingFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
