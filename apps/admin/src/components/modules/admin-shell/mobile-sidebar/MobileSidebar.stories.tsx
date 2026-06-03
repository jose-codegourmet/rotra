"use client";

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
	countUnreadNotifications,
	MOCK_NOTIFICATIONS,
} from "@/constants/mock-notifications";
import { MobileSidebar } from "./MobileSidebar";

const meta: Meta<typeof MobileSidebar> = {
	title: "rotra/admin-shell/MobileSidebar",
	component: MobileSidebar,
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
type Story = StoryObj<typeof MobileSidebar>;

function MobileSidebarDemo() {
	const [open, setOpen] = React.useState(true);
	return (
		<div className="min-h-screen bg-bg-base">
			<button
				type="button"
				className="fixed left-4 top-4 z-[70] rounded-lg border border-border bg-bg-surface px-3 py-2 text-small text-text-primary"
				onClick={() => setOpen((v) => !v)}
			>
				Toggle drawer
			</button>
			<MobileSidebar
				open={open}
				pathname="/dashboard"
				adminRole="super_admin"
				unreadCount={countUnreadNotifications(MOCK_NOTIFICATIONS)}
				onClose={() => setOpen(false)}
				onRequestSignOut={() => setOpen(false)}
			/>
		</div>
	);
}

export const Open: Story = {
	render: () => <MobileSidebarDemo />,
};

export const Closed: Story = {
	args: {
		open: false,
		pathname: "/waitlist",
		adminRole: "admin",
		unreadCount: countUnreadNotifications(MOCK_NOTIFICATIONS),
		onClose: () => {},
		onRequestSignOut: () => {},
	},
};
