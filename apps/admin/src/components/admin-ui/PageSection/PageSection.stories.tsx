import type { Meta, StoryObj } from "@storybook/react";
import { PageSection } from "./PageSection";

const meta: Meta<typeof PageSection> = {
	title: "admin-ui/PageSection",
	component: PageSection,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageSection>;

export const Default: Story = {
	args: {
		title: "Section title",
		description: "Optional description copy that explains this block.",
		children: (
			<div className="rounded-lg border border-border bg-bg-elevated p-4 text-body text-text-secondary">
				Slot content
			</div>
		),
	},
};

export const WithoutDescription: Story = {
	args: {
		title: "Title only",
		children: (
			<p className="text-body text-text-secondary">No description prop.</p>
		),
	},
};
