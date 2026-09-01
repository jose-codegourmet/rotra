import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_VERIFICATION } from "@/constants/mock-customers";

import { CustomerVerificationSection } from "./CustomerVerificationSection";

const meta: Meta<typeof CustomerVerificationSection> = {
	title: "Modules/Customers/CustomerVerificationSection",
	component: CustomerVerificationSection,
	args: { profile: MOCK_CUSTOMER_PROFILE_VERIFICATION },
};

export default meta;

type Story = StoryObj<typeof CustomerVerificationSection>;

export const Default: Story = {};
