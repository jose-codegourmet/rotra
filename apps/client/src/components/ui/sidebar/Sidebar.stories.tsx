import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
	title: "Navigation/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/dashboard" } },
	},
};

export const ActiveClubs: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/clubs" } },
	},
};

export const ActiveSessions: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/sessions" } },
	},
};

export const ActiveProfile: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/profile" } },
	},
};
