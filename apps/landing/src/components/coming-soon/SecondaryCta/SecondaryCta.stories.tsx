import type { Meta, StoryObj } from "@storybook/nextjs";

import { SecondaryCta } from "./SecondaryCta";

const meta = {
	title: "ComingSoon/SecondaryCta",
	component: SecondaryCta,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof SecondaryCta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
