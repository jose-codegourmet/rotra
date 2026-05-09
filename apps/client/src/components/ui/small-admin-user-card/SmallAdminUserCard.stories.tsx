import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_AUTH_USER_WITH_NAME } from "@/constants/mock-auth-user";
import { SmallAdminUserCard } from "./SmallAdminUserCard";

const meta: Meta<typeof SmallAdminUserCard> = {
	title: "UI/SmallAdminUserCard",
	component: SmallAdminUserCard,
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SmallAdminUserCard>;

export const SuperAdmin: Story = {
	args: {
		user: MOCK_AUTH_USER_WITH_NAME,
		adminRole: "super_admin",
	},
};

export const Admin: Story = {
	args: {
		user: MOCK_AUTH_USER_WITH_NAME,
		adminRole: "admin",
	},
};

export const Mobile: Story = {
	args: {
		user: MOCK_AUTH_USER_WITH_NAME,
		adminRole: "admin",
		isMobile: true,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
