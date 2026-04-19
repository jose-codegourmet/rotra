import type { Meta, StoryObj } from "@storybook/nextjs";

import { WaitlistForm } from "./WaitlistForm";

const mockSubmit = async (email: string) => {
	if (!email.includes("@")) {
		return { ok: false as const, error: "Check your email address." };
	}
	return { ok: true as const };
};

const meta = {
	title: "ComingSoon/WaitlistForm",
	component: WaitlistForm,
	parameters: {
		layout: "centered",
	},
	args: {
		submitWaitlist: mockSubmit,
	},
	tags: ["autodocs"],
} satisfies Meta<typeof WaitlistForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
