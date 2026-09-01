import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE } from "@/constants/mock-customers";

import { CustomerSkillsSection } from "./CustomerSkillsSection";

const meta: Meta<typeof CustomerSkillsSection> = {
	title: "Modules/Customers/CustomerSkillsSection",
	component: CustomerSkillsSection,
	args: { profile: MOCK_CUSTOMER_PROFILE },
};

export default meta;

type Story = StoryObj<typeof CustomerSkillsSection>;

export const Default: Story = {};
