import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { CustomerTagsSection } from "./CustomerTagsSection";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test Player",
	email: null,
	phone: null,
	avatarUrl: null,
	isVerified: false,
	emailVerified: false,
	mmr: 1000,
	mmrMatchesPlayed: 0,
	playingLevel: null,
	formatPreference: null,
	courtPosition: null,
	playMode: null,
	onboardingCompleted: false,
	expTotal: 0,
	tags: [
		{
			id: "00000000-0000-4000-8000-000000000099",
			slug: "beta-tester---scheduling",
			label: "beta tester - scheduling",
			assignedAt: new Date().toISOString(),
		},
	],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof CustomerTagsSection> = {
	title: "Modules/Customers/CustomerTagsSection",
	component: CustomerTagsSection,
	args: { profile: mockProfile },
};

export default meta;

type Story = StoryObj<typeof CustomerTagsSection>;

export const Default: Story = {};
