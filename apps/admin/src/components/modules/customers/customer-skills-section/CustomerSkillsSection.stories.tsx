import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { CustomerSkillsSection } from "./CustomerSkillsSection";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test Player",
	email: "player@example.com",
	phone: null,
	avatarUrl: null,
	isVerified: true,
	emailVerified: true,
	mmr: 1200,
	mmrMatchesPlayed: 5,
	playingLevel: "intermediate",
	formatPreference: "doubles",
	courtPosition: "front",
	playMode: "competitive",
	onboardingCompleted: true,
	expTotal: 100,
	tags: [],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof CustomerSkillsSection> = {
	title: "Modules/Customers/CustomerSkillsSection",
	component: CustomerSkillsSection,
	args: { profile: mockProfile },
};

export default meta;

type Story = StoryObj<typeof CustomerSkillsSection>;

export const Default: Story = {};
