import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { CustomerVerificationSection } from "./CustomerVerificationSection";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test Player",
	email: "a@b.co",
	phone: null,
	avatarUrl: null,
	isVerified: true,
	emailVerified: true,
	mmr: 1000,
	mmrMatchesPlayed: 0,
	playingLevel: null,
	formatPreference: null,
	courtPosition: null,
	playMode: null,
	onboardingCompleted: true,
	expTotal: 0,
	tags: [],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof CustomerVerificationSection> = {
	title: "Modules/Customers/CustomerVerificationSection",
	component: CustomerVerificationSection,
	args: { profile: mockProfile },
};

export default meta;

type Story = StoryObj<typeof CustomerVerificationSection>;

export const Default: Story = {};
