import type { Meta, StoryObj } from "@storybook/nextjs";

import type { WaitlistResult } from "@/server/actions/waitlist";

import { HeroSection } from "./HeroSection";

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
	title: "ComingSoon/HeroSection",
	component: HeroSection,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		waitlistAction: mockAction,
	},
	tags: ["autodocs"],
} satisfies Meta<typeof HeroSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
