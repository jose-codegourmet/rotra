"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SidebarUserMenu } from "./SidebarUserMenu";

const meta: Meta<typeof SidebarUserMenu> = {
	title: "Navigation/SidebarUserMenu",
	component: SidebarUserMenu,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
};

export default meta;
type Story = StoryObj<typeof SidebarUserMenu>;

export const Default: Story = {
	render: () => (
		<div className="flex min-h-[280px] w-64 flex-col border border-border rounded-lg bg-bg-base">
			<div className="flex-1" />
			<SidebarUserMenu />
		</div>
	),
};
