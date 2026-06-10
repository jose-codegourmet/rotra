"use client";

import type { Meta, StoryObj } from "@storybook/react";
import type { ActiveSessionSummary } from "@/types/session-discovery";
import { AlreadyInSessionDialog } from "./AlreadyInSessionDialog";

const activeSession: ActiveSessionSummary = {
	sessionId: "session-active-1",
	clubName: "Sunrise Badminton Club",
	location: "Hall B",
	status: "open",
	playerStatus: "waiting",
	admissionStatus: "accepted",
	courtHint: "Up next",
	href: "/sessions/session-active-1",
};

const meta: Meta<typeof AlreadyInSessionDialog> = {
	title: "dashboard/AlreadyInSessionDialog",
	component: AlreadyInSessionDialog,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlreadyInSessionDialog>;

const noop = () => {};

export const Open: Story = {
	args: {
		open: true,
		onOpenChange: noop,
		activeSession,
		onGoToSession: noop,
	},
};
