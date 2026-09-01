import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_AUDIT } from "@/constants/mock-customers";

import { CustomerAuditSection } from "./CustomerAuditSection";

const meta: Meta<typeof CustomerAuditSection> = {
	title: "Modules/Customers/CustomerAuditSection",
	component: CustomerAuditSection,
	args: { profile: MOCK_CUSTOMER_PROFILE_AUDIT },
};

export default meta;

type Story = StoryObj<typeof CustomerAuditSection>;

export const Default: Story = {};
