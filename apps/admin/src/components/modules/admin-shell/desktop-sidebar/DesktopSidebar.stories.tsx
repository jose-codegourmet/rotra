"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { DesktopSidebar } from "./DesktopSidebar";

const meta: Meta<typeof DesktopSidebar> = {
	title: "rotra/admin-shell/DesktopSidebar",
	component: DesktopSidebar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/dashboard",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof DesktopSidebar>;

export const Default: Story = {
	args: {
		pathname: "/dashboard",
		adminRole: "super_admin",
	},
};

export const CustomersSectionActive: Story = {
	args: {
		pathname: "/customers/abc-123",
		adminRole: "admin",
	},
	parameters: {
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/customers/abc-123",
			},
		},
	},
};
