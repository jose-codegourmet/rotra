import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_ADMIN_USERS } from "@/constants/mock-admin-users";
import { AdminUsersTable } from "./AdminUsersTable";

const meta: Meta<typeof AdminUsersTable> = {
	title: "rotra/AdminUsersTable",
	component: AdminUsersTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdminUsersTable>;

export const Default: Story = {
	args: {
		data: MOCK_ADMIN_USERS,
	},
};
