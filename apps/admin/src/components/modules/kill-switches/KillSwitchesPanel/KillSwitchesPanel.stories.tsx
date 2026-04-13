import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_KILL_SWITCHES } from "@/constants/mock-admin-pages";
import { KillSwitchesPanel } from "./KillSwitchesPanel";

const meta: Meta<typeof KillSwitchesPanel> = {
	title: "rotra/KillSwitchesPanel",
	component: KillSwitchesPanel,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KillSwitchesPanel>;

export const Default: Story = {
	args: {
		rows: MOCK_KILL_SWITCHES,
	},
};
