import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { CustomerAuditSection } from "./CustomerAuditSection";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test",
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
	tags: [],
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-02-01T12:00:00.000Z",
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof CustomerAuditSection> = {
	title: "Modules/Customers/CustomerAuditSection",
	component: CustomerAuditSection,
	args: { profile: mockProfile },
};

export default meta;

type Story = StoryObj<typeof CustomerAuditSection>;

export const Default: Story = {};
