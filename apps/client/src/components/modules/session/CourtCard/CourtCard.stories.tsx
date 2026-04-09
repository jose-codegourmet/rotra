import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_COURTS } from "@/constants/mock-session-ui";

import { CourtCard } from "./CourtCard";

const meta: Meta<typeof CourtCard> = {
	title: "session/CourtCard",
	component: CourtCard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CourtCard>;

export const Active: Story = {
	args: {
		court: MOCK_COURTS[0],
	},
};

export const ActiveTraining: Story = {
	args: {
		court: MOCK_COURTS[2],
	},
};

export const Empty: Story = {
	args: {
		court: MOCK_COURTS[3],
	},
};
