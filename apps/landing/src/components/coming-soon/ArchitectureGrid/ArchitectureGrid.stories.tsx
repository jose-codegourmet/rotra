import type { Meta, StoryObj } from "@storybook/nextjs";

import { ArchitectureGrid } from "./ArchitectureGrid";

const meta = {
	title: "ComingSoon/ArchitectureGrid",
	component: ArchitectureGrid,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ArchitectureGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
