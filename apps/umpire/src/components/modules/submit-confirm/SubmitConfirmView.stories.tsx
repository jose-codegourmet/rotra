import type { Meta, StoryObj } from "@storybook/react";
import { SubmitConfirmView } from "./SubmitConfirmView";

const meta: Meta<typeof SubmitConfirmView> = {
	title: "umpire/SubmitConfirmView",
	component: SubmitConfirmView,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof SubmitConfirmView>;

export const ReadyToLock: Story = {
	args: {
		initiallyLocked: false,
	},
};

export const Locked: Story = {
	args: {
		initiallyLocked: true,
	},
};
