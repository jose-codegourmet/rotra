import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { StatsCards } from "./StatsCards";

const meta: Meta<typeof StatsCards> = {
	title: "profile/StatsCards",
	component: StatsCards,
	tags: ["autodocs"],
	argTypes: {
		player: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof StatsCards>;

export const Default: Story = {
	args: {
		player: MOCK_PLAYER,
	},
};

export const NoAccentStats: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			stats: MOCK_PLAYER.stats.map((s) => ({ ...s, accent: false })),
		},
	},
};

export const AllAccentStats: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			stats: MOCK_PLAYER.stats.map((s) => ({ ...s, accent: true })),
		},
	},
};

export const NoSubText: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			stats: MOCK_PLAYER.stats.map(({ sub: _sub, ...s }) => s),
		},
	},
};
