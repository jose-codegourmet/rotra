import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_NEXT_QUEUE } from "@/constants/mock-session-ui";

import { NextQueueRow } from "./NextQueueRow";

const meta: Meta<typeof NextQueueRow> = {
	title: "session/NextQueueRow",
	component: NextQueueRow,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NextQueueRow>;

export const Default: Story = {
	args: { item: MOCK_NEXT_QUEUE[0] },
};

export const LongMatchup: Story = {
	args: {
		item: {
			...MOCK_NEXT_QUEUE[1],
			matchup: "Very Long Team Names Alpha vs Bravo Championship",
		},
	},
};
