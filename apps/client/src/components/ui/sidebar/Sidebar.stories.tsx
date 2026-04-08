import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
	title: "Navigation/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		activeItem: {
			control: "select",
			options: ["home", "clubs", "sessions", "profile"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
	args: {
		activeItem: "home",
	},
};

export const ActiveClubs: Story = {
	args: {
		activeItem: "clubs",
	},
};

export const ActiveSessions: Story = {
	args: {
		activeItem: "sessions",
	},
};

export const ActiveProfile: Story = {
	args: {
		activeItem: "profile",
	},
};
