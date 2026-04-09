import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_LEDGER } from "@/constants/mock-session-ui";

import { SessionLedgerRow } from "./SessionFinancialsView";

const meta: Meta<typeof SessionLedgerRow> = {
	title: "session/SessionLedgerRow",
	component: SessionLedgerRow,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SessionLedgerRow>;

export const Paid: Story = {
	args: { row: MOCK_LEDGER[0] },
};

export const Pending: Story = {
	args: { row: MOCK_LEDGER[1] },
};

export const Partial: Story = {
	args: { row: MOCK_LEDGER[3] },
};
