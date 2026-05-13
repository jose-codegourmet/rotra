"use client";

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import { SignOutDialog } from "./SignOutDialog";

const meta: Meta<typeof SignOutDialog> = {
	title: "rotra/admin-shell/SignOutDialog",
	component: SignOutDialog,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SignOutDialog>;

function SignOutDialogDemo({
	initialError,
	startPending,
}: {
	initialError?: string | null;
	startPending?: boolean;
}) {
	const [open, setOpen] = React.useState(true);
	const [pending, setPending] = React.useState(Boolean(startPending));
	const [error, setError] = React.useState<string | null>(initialError ?? null);

	return (
		<div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-6">
			<Button type="button" variant="outline" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<SignOutDialog
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) setError(null);
				}}
				pending={pending}
				error={error}
				onCancel={() => {
					setError(null);
					setOpen(false);
				}}
				onConfirm={() => {
					setPending(true);
					setError(null);
					window.setTimeout(() => {
						setPending(false);
						setOpen(false);
					}, 800);
				}}
			/>
		</div>
	);
}

export const Default: Story = {
	render: () => <SignOutDialogDemo />,
};

export const WithError: Story = {
	render: () => <SignOutDialogDemo initialError="Network error. Try again." />,
};

export const Pending: Story = {
	render: () => <SignOutDialogDemo startPending />,
};
