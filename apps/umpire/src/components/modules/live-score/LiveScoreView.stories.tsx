import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_LIVE_SCORE } from "@/constants/mock-umpire-match";
import { LiveScoreView } from "./LiveScoreView";

const meta: Meta<typeof LiveScoreView> = {
	title: "umpire/LiveScoreView",
	component: LiveScoreView,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof LiveScoreView>;

export const Default: Story = {
	args: {
		initialTeamA: MOCK_LIVE_SCORE.teamAPoints,
		initialTeamB: MOCK_LIVE_SCORE.teamBPoints,
		initialLastPoint: MOCK_LIVE_SCORE.lastPoint,
	},
};

export const TiedOpening: Story = {
	args: {
		initialTeamA: 0,
		initialTeamB: 0,
		initialLastPoint: null,
	},
};
