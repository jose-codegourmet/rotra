import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_ROSTER } from "@/constants/mock-session-ui";

import { PlayerQueueCard } from "./PlayerQueueCard";

const meta: Meta<typeof PlayerQueueCard> = {
	title: "session/PlayerQueueCard",
	component: PlayerQueueCard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlayerQueueCard>;

export const Waiting: Story = {
	args: { player: MOCK_ROSTER[0] },
};

export const Playing: Story = {
	args: { player: MOCK_ROSTER[1] },
};

export const AwayDisabled: Story = {
	args: { player: MOCK_ROSTER[3] },
};

export const Selected: Story = {
	args: { player: MOCK_ROSTER[0], selected: true, onClick: () => {} },
};

export const Ready: Story = {
	args: { player: MOCK_ROSTER[4] },
};
