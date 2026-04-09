import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { PlayerHeaderCard } from "./PlayerHeaderCard";

const meta: Meta<typeof PlayerHeaderCard> = {
	title: "profile/PlayerHeaderCard",
	component: PlayerHeaderCard,
	tags: ["autodocs"],
	argTypes: {
		player: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof PlayerHeaderCard>;

export const Default: Story = {
	args: {
		player: MOCK_PLAYER,
	},
};

export const BeginnerPlayer: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			name: "Sam Lee",
			initials: "SL",
			level: "Beginner",
			tier: "Novice 1",
			tierPips: { filled: 1, total: 3 },
		},
	},
};

export const AdvancedPlayer: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			name: "Elena Reyes",
			initials: "ER",
			level: "Advanced",
			tier: "Legend 3",
			tierPips: { filled: 5, total: 5 },
		},
	},
};
