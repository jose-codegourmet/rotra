import type { Meta, StoryObj } from "@storybook/nextjs";

import type { WaitlistResult } from "@/server/actions/waitlist";

import { WaitlistSection } from "./WaitlistSection";

const mockAction = async (
	_prev: WaitlistResult | undefined,
	formData: FormData,
): Promise<WaitlistResult> => {
	const email = formData.get("email");
	if (typeof email !== "string" || !email.includes("@")) {
		return { ok: false, error: "Check your email address." };
	}
	return { ok: true };
};

const meta = {
	title: "ComingSoon/WaitlistSection",
	component: WaitlistSection,
	parameters: {
		layout: "padded",
	},
	args: {
		action: mockAction,
	},
	tags: ["autodocs"],
} satisfies Meta<typeof WaitlistSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
