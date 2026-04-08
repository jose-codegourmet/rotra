import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
	title: "Navigation/Navbar",
	component: Navbar,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		pageTitle: { control: "text" },
		pageSubtitle: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
	args: {
		pageTitle: "Dashboard",
		pageSubtitle: "ROTRA",
	},
};

export const ClubProfile: Story = {
	args: {
		pageTitle: "Club Profile",
		pageSubtitle: "Sunrise Badminton Club",
	},
};

export const Sessions: Story = {
	args: {
		pageTitle: "Sessions",
		pageSubtitle: "Upcoming & Recurring",
	},
};
