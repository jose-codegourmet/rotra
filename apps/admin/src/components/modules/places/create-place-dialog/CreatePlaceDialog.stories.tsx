import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MOCK_ADDRESS_PIN_VALUE } from "@/constants/places-mocks";

import { CreatePlaceDialog } from "./CreatePlaceDialog";

function CreatePlaceDialogStory() {
	const [open, setOpen] = useState(true);

	return (
		<CreatePlaceDialog
			open={open}
			onOpenChange={setOpen}
			onSuccess={() => undefined}
			onError={() => undefined}
		/>
	);
}

const meta: Meta<typeof CreatePlaceDialog> = {
	title: "modules/places/CreatePlaceDialog",
	component: CreatePlaceDialog,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof CreatePlaceDialog>;

export const Default: Story = {
	render: () => <CreatePlaceDialogStory />,
};

export const Closed: Story = {
	args: {
		open: false,
		onOpenChange: () => undefined,
		onSuccess: () => undefined,
		onError: () => undefined,
	},
};

/** Reference pin used by AddressPinField in map stories. */
export const MockPinReference = {
	render: () => (
		<pre className="p-4 text-small text-text-secondary">
			{JSON.stringify(MOCK_ADDRESS_PIN_VALUE, null, 2)}
		</pre>
	),
};
