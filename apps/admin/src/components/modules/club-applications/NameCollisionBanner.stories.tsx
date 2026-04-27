import type { Meta, StoryObj } from "@storybook/react";

import { NameCollisionBanner } from "./NameCollisionBanner";

const meta: Meta<typeof NameCollisionBanner> = {
	title: "modules/club-applications/NameCollisionBanner",
	component: NameCollisionBanner,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NameCollisionBanner>;

export const WithCollisions: Story = {
	args: {
		clubs: [
			{
				id: "c1",
				name: "North Stars",
				locationCity: "Manila",
				status: "active",
				ownerName: "Alex P.",
				createdAt: new Date().toISOString(),
			},
		],
	},
};

export const Empty: Story = {
	args: { clubs: [] },
};
