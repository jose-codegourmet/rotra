import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_EDIT_SKILLS } from "@/constants/mock-customers";

import { EditCustomerSkillsForm } from "./EditCustomerSkillsForm";

const meta: Meta<typeof EditCustomerSkillsForm> = {
	title: "Modules/Customers/EditCustomerSkillsForm",
	component: EditCustomerSkillsForm,
	args: {
		profileId: MOCK_CUSTOMER_PROFILE_EDIT_SKILLS.id,
		profile: MOCK_CUSTOMER_PROFILE_EDIT_SKILLS,
		onDismiss: () => {},
		onSuccess: () => {},
		onError: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof EditCustomerSkillsForm>;

export const Default: Story = {};
