import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MOCK_PLACE_UNREVIEWED } from "@/constants/places-mocks";

import { ReviewPlaceDialog } from "./ReviewPlaceDialog";

function ReviewPlaceDialogStory() {
	const [open, setOpen] = useState(true);

	return (
		<ReviewPlaceDialog
			place={MOCK_PLACE_UNREVIEWED}
			open={open}
			onOpenChange={setOpen}
			onConfirmSuccess={() => undefined}
			onDeleteSuccess={() => undefined}
		/>
	);
}

const meta: Meta<typeof ReviewPlaceDialog> = {
	title: "modules/places/ReviewPlaceDialog",
	component: ReviewPlaceDialog,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReviewPlaceDialog>;

export const Default: Story = {
	render: () => <ReviewPlaceDialogStory />,
};
