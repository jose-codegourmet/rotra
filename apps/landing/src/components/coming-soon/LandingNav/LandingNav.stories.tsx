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
