import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { PlayStyleCard } from "./PlayStyleCard";

const meta: Meta<typeof PlayStyleCard> = {
	title: "profile/PlayStyleCard",
	component: PlayStyleCard,
	tags: ["autodocs"],
	argTypes: {
		player: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof PlayStyleCard>;

export const Default: Story = {
	args: {
		player: MOCK_PLAYER,
	},
};

export const SingleTag: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			playStyle: ["All-Rounder"],
		},
	},
};

export const ManyTags: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			playStyle: [
				"Aggressive Smasher",
				"Net Specialist",
				"Endurance Tank",
				"Defensive Baseline",
				"Drop Shot Artist",
				"Serve & Net",
			],
		},
	},
};

export const EmptyTags: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			playStyle: [],
		},
	},
};
