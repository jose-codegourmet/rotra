import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_WAITLIST_STATS } from "@/constants/mock-waitlist";

import { WaitlistStats } from "./WaitlistStats";

const meta: Meta<typeof WaitlistStats> = {
	title: "rotra/WaitlistStats",
	component: WaitlistStats,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WaitlistStats>;

export const Default: Story = {
	args: {
		stats: MOCK_WAITLIST_STATS,
		isLoading: false,
		isError: false,
	},
};

export const Loading: Story = {
	args: {
		stats: null,
		isLoading: true,
		isError: false,
	},
};

export const ErrorState: Story = {
	args: {
		stats: null,
		isLoading: false,
		isError: true,
		error: new Error("Failed to load statistics."),
	},
};
