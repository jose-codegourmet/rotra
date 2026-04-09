import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { MatchHistory } from "./MatchHistory";

const meta: Meta<typeof MatchHistory> = {
	title: "profile/MatchHistory",
	component: MatchHistory,
	tags: ["autodocs"],
	argTypes: {
		matches: { control: "object" },
		maxMatchPerView: { control: "number" },
		viewAllHref: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof MatchHistory>;

export const Default: Story = {
	args: {
		matches: MOCK_PLAYER.recentMatches,
		maxMatchPerView: 3,
	},
};

export const WithViewAllLink: Story = {
	args: {
		matches: MOCK_PLAYER.recentMatches,
		maxMatchPerView: 3,
		viewAllHref: "/matches",
	},
};

export const LimitedToOne: Story = {
	args: {
		matches: MOCK_PLAYER.recentMatches,
		maxMatchPerView: 1,
	},
};

export const EmptyHistory: Story = {
	args: {
		matches: [],
		maxMatchPerView: 5,
	},
};
