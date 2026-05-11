import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { EditCustomerSkillsForm } from "./EditCustomerSkillsForm";

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
	playingLevel: "intermediate",
	formatPreference: "doubles",
	courtPosition: "front",
	playMode: "competitive",
	onboardingCompleted: false,
	expTotal: 0,
	tags: [],
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
} satisfies CustomerProfileSerialized;

const meta: Meta<typeof EditCustomerSkillsForm> = {
	title: "Modules/Customers/EditCustomerSkillsForm",
	component: EditCustomerSkillsForm,
	args: {
		profileId: mockProfile.id,
		profile: mockProfile,
		onDismiss: () => {},
		onSuccess: () => {},
		onError: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof EditCustomerSkillsForm>;

export const Default: Story = {};
