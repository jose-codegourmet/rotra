"use client";

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { MobileNavBackdrop } from "./MobileNavBackdrop";

const meta: Meta<typeof MobileNavBackdrop> = {
	title: "rotra/admin-shell/MobileNavBackdrop",
	component: MobileNavBackdrop,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof MobileNavBackdrop>;

function BackdropDemo() {
	const [open, setOpen] = React.useState(true);
	return (
		<div className="relative min-h-screen bg-bg-base p-4">
			<p className="text-body text-text-secondary">
				Tap the dimmed area to dismiss (calls onDismiss).
			</p>
			<button
				type="button"
				className="mt-4 rounded-lg border border-border px-3 py-2 text-small text-text-primary"
				onClick={() => setOpen((v) => !v)}
			>
				Toggle open
			</button>
			<MobileNavBackdrop open={open} onDismiss={() => setOpen(false)} />
		</div>
	);
}

export const Default: Story = {
	render: () => <BackdropDemo />,
};

export const Closed: Story = {
	args: {
		open: false,
		onDismiss: () => {},
	},
};
