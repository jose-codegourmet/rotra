import type { Meta, StoryObj } from "@storybook/react";

import { CustomerDetailActions } from "./CustomerDetailActions";

const meta: Meta<typeof CustomerDetailActions> = {
	title: "modules/customers/CustomerDetailActions",
	component: CustomerDetailActions,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomerDetailActions>;

export const WithClientLink: Story = {
	args: {
		moderationHref:
			"/moderation?tab=accounts&player=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		clientProfileUrl:
			"https://app.example.com/profile/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
	},
};

export const WithoutClientLink: Story = {
	args: {
		moderationHref:
			"/moderation?tab=accounts&player=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		clientProfileUrl: null,
	},
};
