import type { Meta, StoryObj } from "@storybook/react";

import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { EditCustomerBasicInfoForm } from "./EditCustomerBasicInfoForm";

const mockProfile = {
	id: "00000000-0000-4000-8000-000000000001",
	name: "Test Player",
	email: "player@example.com",
	phone: "+639171234567",
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

const meta: Meta<typeof EditCustomerBasicInfoForm> = {
	title: "Modules/Customers/EditCustomerBasicInfoForm",
	component: EditCustomerBasicInfoForm,
	args: {
		profileId: mockProfile.id,
		profile: mockProfile,
		onDismiss: () => {},
		onSuccess: () => {},
		onError: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof EditCustomerBasicInfoForm>;

export const Default: Story = {};
