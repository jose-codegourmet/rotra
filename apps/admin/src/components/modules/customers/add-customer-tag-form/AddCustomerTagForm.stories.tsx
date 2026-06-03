import type { Meta, StoryObj } from "@storybook/react";

import { AddCustomerTagForm } from "./AddCustomerTagForm";

const meta: Meta<typeof AddCustomerTagForm> = {
	title: "Modules/Customers/AddCustomerTagForm",
	component: AddCustomerTagForm,
	args: {
		profileId: "00000000-0000-4000-8000-000000000001",
		callerIsSuperAdmin: true,
		onDismiss: () => {},
		onSuccess: () => {},
		onError: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof AddCustomerTagForm>;

export const Default: Story = {};
