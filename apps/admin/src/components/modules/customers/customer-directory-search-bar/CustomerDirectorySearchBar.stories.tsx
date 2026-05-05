import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { CustomerDirectorySearchBar } from "./CustomerDirectorySearchBar";

const meta: Meta<typeof CustomerDirectorySearchBar> = {
	title: "modules/customers/CustomerDirectorySearchBar",
	component: CustomerDirectorySearchBar,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomerDirectorySearchBar>;

function ControlledExample() {
	const [value, setValue] = useState("");
	return (
		<div className="max-w-xl rounded-lg border border-border bg-bg-surface p-4">
			<CustomerDirectorySearchBar value={value} onChange={setValue} />
			<p className="mt-4 text-small text-text-secondary">
				Current value: {value || "(empty)"}
			</p>
		</div>
	);
}

export const Default: Story = {
	render: () => <ControlledExample />,
};
