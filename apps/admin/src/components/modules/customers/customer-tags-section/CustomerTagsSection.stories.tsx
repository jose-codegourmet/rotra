import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_TAGS } from "@/constants/mock-customers";

import { CustomerTagsSection } from "./CustomerTagsSection";

const meta: Meta<typeof CustomerTagsSection> = {
	title: "Modules/Customers/CustomerTagsSection",
	component: CustomerTagsSection,
	args: { profile: MOCK_CUSTOMER_PROFILE_TAGS, callerIsSuperAdmin: true },
};

export default meta;

type Story = StoryObj<typeof CustomerTagsSection>;

export const Default: Story = {};
