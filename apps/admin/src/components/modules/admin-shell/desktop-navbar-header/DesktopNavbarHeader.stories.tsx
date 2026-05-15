"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
	countUnreadNotifications,
	MOCK_NOTIFICATIONS,
} from "@/constants/mock-notifications";
import { DesktopNavbarHeader } from "./DesktopNavbarHeader";

const meta: Meta<typeof DesktopNavbarHeader> = {
	title: "rotra/admin-shell/DesktopNavbarHeader",
	component: DesktopNavbarHeader,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof DesktopNavbarHeader>;

export const Default: Story = {
	args: {
		pageTitle: "Dashboard",
		onRequestSignOut: () => {},
		notifications: MOCK_NOTIFICATIONS,
		unreadCount: countUnreadNotifications(MOCK_NOTIFICATIONS),
	},
};
