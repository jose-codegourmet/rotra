import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_STATS } from "@/constants/mock-customers";

import { CustomerStatsSection } from "./CustomerStatsSection";

const meta: Meta<typeof CustomerStatsSection> = {
	title: "Modules/Customers/CustomerStatsSection",
	component: CustomerStatsSection,
	args: { profile: MOCK_CUSTOMER_PROFILE_STATS },
};

export default meta;

type Story = StoryObj<typeof CustomerStatsSection>;

export const Default: Story = {};
