import type { Meta, StoryObj } from "@storybook/react";
import { AdminLoginCard } from "./AdminLoginCard";

const meta: Meta<typeof AdminLoginCard> = {
	title: "rotra/AdminLoginCard",
	component: AdminLoginCard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdminLoginCard>;

export const Default: Story = {
	render: () => (
		<div className="flex min-h-[480px] items-center justify-center p-6">
			<AdminLoginCard />
		</div>
	),
};
