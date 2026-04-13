import type { Meta, StoryObj } from "@storybook/react";
import { AdminShell } from "./AdminShell";

const meta: Meta<typeof AdminShell> = {
	title: "layout/AdminShell",
	component: AdminShell,
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
type Story = StoryObj<typeof AdminShell>;

export const Default: Story = {
	args: {
		children: (
			<div className="rounded-lg border border-border bg-bg-surface p-6 text-body text-text-secondary">
				<p className="text-heading text-text-primary">Overview</p>
				<p className="mt-2">
					Static placeholder content for the admin dashboard view.
				</p>
			</div>
		),
	},
};

export const AnalyticsRoute: Story = {
	args: {
		children: (
			<p className="text-body text-text-secondary">
				Title is derived from the mocked pathname (/analytics).
			</p>
		),
	},
	parameters: {
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/analytics",
			},
		},
	},
};
