import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE } from "@/constants/mock-customers";

import { CustomerBasicInfoSection } from "./CustomerBasicInfoSection";

const meta: Meta<typeof CustomerBasicInfoSection> = {
	title: "Modules/Customers/CustomerBasicInfoSection",
	component: CustomerBasicInfoSection,
	args: { profile: MOCK_CUSTOMER_PROFILE },
};

export default meta;

type Story = StoryObj<typeof CustomerBasicInfoSection>;

export const Default: Story = {};
