"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { SessionTabId } from "@/constants/mock-session-ui";

import { SessionTabNav } from "./SessionTabNav";

const meta: Meta<typeof SessionTabNav> = {
	title: "session/SessionTabNav",
	component: SessionTabNav,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SessionTabNav>;

export const StandingActive: Story = {
	args: {
		active: "standing",
		onChange: () => {},
	},
};

export const Interactive: Story = {
	render: function Render() {
		const [tab, setTab] = useState<SessionTabId>("queue");
		return <SessionTabNav active={tab} onChange={setTab} />;
	},
};
