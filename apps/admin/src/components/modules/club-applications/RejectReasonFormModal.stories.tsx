import type { Meta, StoryObj } from "@storybook/react";

import { RejectReasonFormModal } from "./RejectReasonFormModal";

const meta: Meta<typeof RejectReasonFormModal> = {
	title: "modules/club-applications/RejectReasonFormModal",
	component: RejectReasonFormModal,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RejectReasonFormModal>;

export const Default: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		mutationTarget: { type: "single", applicationId: "application-123" },
		onSuccess: () => {},
		onError: () => {},
	},
};
