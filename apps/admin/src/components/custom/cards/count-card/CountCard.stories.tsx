import type { Meta, StoryObj } from "@storybook/react";

import { CountCard } from "./CountCard";

const meta: Meta<typeof CountCard> = {
	title: "custom/cards/CountCard",
	component: CountCard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountCard>;

export const Default: Story = {
	args: {
		title: "Total",
		count: 12,
		tone: "primary",
	},
};

export const Animated: Story = {
	args: {
		title: "Active",
		count: 8,
		tone: "accent",
		animateCount: true,
	},
};

export const CompactLayout: Story = {
	args: {
		title: "Admins",
		count: 12,
		layout: "compact",
		tone: "primary",
		subLabel: <span className="text-small text-text-disabled">Team-wide</span>,
	},
};

export const KpiLayout: Story = {
	args: {
		title: "Active clubs",
		count: "128",
		layout: "kpi",
		tone: "primary",
		subLabel: (
			<span className="text-small text-text-disabled">+6 vs last week</span>
		),
	},
};

export const AttentionWarning: Story = {
	args: {
		title: "Open moderation items",
		count: 2,
		layout: "attention",
		tone: "warning",
		animateCount: true,
		subLabel: (
			<a
				href="/"
				className="inline-block text-small text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
			>
				Open moderation
			</a>
		),
	},
};

export const AttentionAccent: Story = {
	args: {
		title: "Pending owner approvals",
		count: 3,
		layout: "attention",
		tone: "accent",
		subLabel: (
			<a
				href="/"
				className="inline-block text-small text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
			>
				Open approvals
			</a>
		),
	},
};
