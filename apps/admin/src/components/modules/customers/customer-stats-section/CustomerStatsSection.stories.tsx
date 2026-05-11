import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { CustomerStatsSection } from "./CustomerStatsSection";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test",
	email: null,
	phone: null,
	avatarUrl: null,
	isVerified: false,
	emailVerified: false,
	mmr: 1150,
	mmrMatchesPlayed: 12,
	playingLevel: null,
	formatPreference: null,
	courtPosition: null,
	playMode: null,
	onboardingCompleted: false,
	expTotal: 250,
	tags: [],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof CustomerStatsSection> = {
	title: "Modules/Customers/CustomerStatsSection",
	component: CustomerStatsSection,
	args: { profile: mockProfile },
};

export default meta;

type Story = StoryObj<typeof CustomerStatsSection>;

export const Default: Story = {};
