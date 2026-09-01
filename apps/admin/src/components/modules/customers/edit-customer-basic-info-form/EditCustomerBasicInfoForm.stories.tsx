import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_PROFILE_EDIT_BASIC_INFO } from "@/constants/mock-customers";

import { EditCustomerBasicInfoForm } from "./EditCustomerBasicInfoForm";

const meta: Meta<typeof EditCustomerBasicInfoForm> = {
	title: "Modules/Customers/EditCustomerBasicInfoForm",
	component: EditCustomerBasicInfoForm,
	args: {
		profileId: MOCK_CUSTOMER_PROFILE_EDIT_BASIC_INFO.id,
		profile: MOCK_CUSTOMER_PROFILE_EDIT_BASIC_INFO,
		onDismiss: () => {},
		onSuccess: () => {},
		onError: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof EditCustomerBasicInfoForm>;

export const Default: Story = {};
