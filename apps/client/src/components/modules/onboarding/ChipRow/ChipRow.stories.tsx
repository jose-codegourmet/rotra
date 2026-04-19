import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ChipRow } from "./ChipRow";

const OPTIONS = [
	{ v: "singles", label: "Singles" },
	{ v: "doubles", label: "Doubles" },
	{ v: "both", label: "Both" },
] as const;

const meta = {
	title: "Modules/Onboarding/ChipRow",
	component: ChipRow,
	parameters: { layout: "centered" },
} satisfies Meta<typeof ChipRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
	render: () => {
		const [value, setValue] = useState<(typeof OPTIONS)[number]["v"] | "">(
			"doubles",
		);
		return (
			<div className="w-[320px]">
				<ChipRow value={value} onChange={setValue} options={OPTIONS} />
			</div>
		);
	},
};
