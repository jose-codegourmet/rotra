import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MOCK_PLACE_CONFIRMED } from "@/constants/places-mocks";

import { EditPlaceDialog } from "./EditPlaceDialog";

function EditPlaceDialogStory() {
	const [open, setOpen] = useState(true);

	return (
		<EditPlaceDialog
			place={MOCK_PLACE_CONFIRMED}
			open={open}
			onOpenChange={setOpen}
			onSuccess={() => undefined}
			onError={() => undefined}
		/>
	);
}

const meta: Meta<typeof EditPlaceDialog> = {
	title: "modules/places/EditPlaceDialog",
	component: EditPlaceDialog,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof EditPlaceDialog>;

export const Default: Story = {
	render: () => <EditPlaceDialogStory />,
};
