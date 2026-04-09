import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { MatchCard } from "./MatchCard";

const meta: Meta<typeof MatchCard> = {
	title: "profile/MatchCard",
	component: MatchCard,
	tags: ["autodocs"],
	argTypes: {
		match: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof MatchCard>;

export const Victory: Story = {
	args: {
		match: MOCK_PLAYER.recentMatches[0],
	},
};

export const Defeat: Story = {
	args: {
		match: MOCK_PLAYER.recentMatches[1],
	},
};

export const SinglesVictory: Story = {
	args: {
		match: MOCK_PLAYER.recentMatches[2],
	},
};

export const CloseGame: Story = {
	args: {
		match: {
			id: "m-close",
			date: "2024-11-05",
			result: "W",
			resultLabel: "Victory",
			yourTeam: "Alex S. / Jamie L.",
			yourTeamLabel: "Your Team",
			opponents: "Marcus D. / Tiana W.",
			opponentsLabel: "Opponents",
			score: "22 – 20",
			club: "City Badminton Club",
		},
	},
};
