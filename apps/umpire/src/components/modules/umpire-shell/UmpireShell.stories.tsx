import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_LIVE_SCORE } from "@/constants/mock-umpire-match";
import { UmpireShell } from "./UmpireShell";

const meta: Meta<typeof UmpireShell> = {
	title: "umpire/UmpireShell",
	component: UmpireShell,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof UmpireShell>;

export const ScoreboardChrome: Story = {
	args: {
		youStatus: MOCK_LIVE_SCORE.youStatus,
		children: (
			<p className="pt-6 text-small text-text-secondary">Main content slot.</p>
		),
	},
};
