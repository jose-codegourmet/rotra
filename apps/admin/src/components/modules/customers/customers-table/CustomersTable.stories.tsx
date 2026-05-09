import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_CUSTOMER_ROWS } from "@/constants/mock-customers";

import { CustomersTable } from "./CustomersTable";

const meta: Meta<typeof CustomersTable> = {
	title: "modules/customers/CustomersTable",
	component: CustomersTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomersTable>;

export const Default: Story = {
	args: {
		rows: MOCK_CUSTOMER_ROWS,
	},
};

export const Empty: Story = {
	args: {
		rows: [],
	},
};
