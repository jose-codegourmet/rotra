import type { Meta, StoryObj } from "@storybook/react";
import { BottomNav } from "./BottomNav";

const meta: Meta<typeof BottomNav> = {
	title: "Navigation/BottomNav",
	component: BottomNav,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	argTypes: {
		activeItem: {
			control: "select",
			options: ["home", "clubs", "sessions", "profile", "notifications"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {
	args: {
		activeItem: "home",
		unreadCount: 8,
	},
};

export const ActiveClubs: Story = {
	args: {
		activeItem: "clubs",
		unreadCount: 8,
	},
};

export const ActiveSessions: Story = {
	args: {
		activeItem: "sessions",
		unreadCount: 8,
	},
};

export const ActiveProfile: Story = {
	args: {
		activeItem: "profile",
		unreadCount: 8,
	},
};
