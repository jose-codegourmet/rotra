import type { Meta, StoryObj } from "@storybook/nextjs";

import { CommunityBand } from "./CommunityBand";

const meta = {
	title: "ComingSoon/CommunityBand",
	component: CommunityBand,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CommunityBand>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
