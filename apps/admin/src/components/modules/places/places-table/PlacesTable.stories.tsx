import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLACES_LIST } from "@/constants/places-mocks";

import { PlacesTable } from "./PlacesTable";

const meta: Meta<typeof PlacesTable> = {
	title: "modules/places/PlacesTable",
	component: PlacesTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlacesTable>;

export const Default: Story = {
	args: {
		data: MOCK_PLACES_LIST,
	},
};

export const Empty: Story = {
	args: {
		data: [],
	},
};
