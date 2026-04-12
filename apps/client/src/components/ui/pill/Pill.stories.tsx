import type { Meta, StoryObj } from "@storybook/react";
import { Pill } from "./Pill";

const meta: Meta<typeof Pill> = {
	title: "shadcn/Pill",
	component: Pill,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["accent", "muted", "outline"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
	args: {
		children: "active",
		variant: "accent",
	},
};

export const Accent: Story = {
	args: {
		children: "active",
		variant: "accent",
	},
};

export const Muted: Story = {
	args: {
		children: "inactive",
		variant: "muted",
	},
};

export const Outline: Story = {
	args: {
		children: "pending",
		variant: "outline",
	},
};

export const MemberStatus: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Pill variant="accent">active</Pill>
			<Pill variant="muted">inactive</Pill>
		</div>
	),
};
