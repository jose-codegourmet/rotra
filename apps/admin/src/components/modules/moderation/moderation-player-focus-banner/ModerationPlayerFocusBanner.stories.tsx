import type { Meta, StoryObj } from "@storybook/react";

import { ModerationPlayerFocusBanner } from "./ModerationPlayerFocusBanner";

const meta: Meta<typeof ModerationPlayerFocusBanner> = {
	title: "modules/moderation/ModerationPlayerFocusBanner",
	component: ModerationPlayerFocusBanner,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModerationPlayerFocusBanner>;

export const AccountsTab: Story = {
	args: {
		playerId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		tab: "accounts",
		tone: "accent",
	},
};

export const DefaultTone: Story = {
	args: {
		playerId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
		tab: null,
		tone: "default",
	},
};
