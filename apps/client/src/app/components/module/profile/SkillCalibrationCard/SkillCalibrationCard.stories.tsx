import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { SkillCalibrationCard } from "./SkillCalibrationCard";

const meta: Meta<typeof SkillCalibrationCard> = {
	title: "profile/SkillCalibrationCard",
	component: SkillCalibrationCard,
	tags: ["autodocs"],
	argTypes: {
		player: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof SkillCalibrationCard>;

export const Default: Story = {
	args: {
		player: MOCK_PLAYER,
	},
};

export const HighSkill: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			skillOverall: 9.8,
		},
	},
};

export const LowSkill: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			skillOverall: 4.2,
		},
	},
};
