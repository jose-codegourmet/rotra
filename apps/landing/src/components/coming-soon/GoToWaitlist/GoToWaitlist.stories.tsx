import type { Meta, StoryObj } from "@storybook/nextjs";

import { GoToWaitlist } from "./GoToWaitlist";

const meta = {
	title: "ComingSoon/GoToWaitlist",
	component: GoToWaitlist,
	parameters: {
		layout: "centered",
	},
	args: {
		children: "Join Waitlist",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof GoToWaitlist>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<GoToWaitlist
			{...args}
			className="rounded-md border border-border-strong px-6 py-3 text-label uppercase tracking-wide text-text-primary"
		/>
	),
};
