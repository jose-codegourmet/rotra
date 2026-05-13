"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { MobileNavbarHeader } from "./MobileNavbarHeader";

const meta: Meta<typeof MobileNavbarHeader> = {
	title: "rotra/admin-shell/MobileNavbarHeader",
	component: MobileNavbarHeader,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof MobileNavbarHeader>;

export const Default: Story = {
	args: {
		pageTitle: "Dashboard",
		onOpenMenu: () => {},
	},
};

export const LongTitle: Story = {
	args: {
		pageTitle: "Very long admin page title that should truncate",
		onOpenMenu: () => {},
	},
};
