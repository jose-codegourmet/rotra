import type { Meta, StoryObj } from "@storybook/react";

import { MmrAsymmetryConfigTable } from "./MmrAsymmetryConfigTable";

const meta: Meta<typeof MmrAsymmetryConfigTable> = {
	title: "rotra/MmrAsymmetryConfigTable",
	component: MmrAsymmetryConfigTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MmrAsymmetryConfigTable>;

export const Default: Story = {
	render: () => (
		<div className="max-w-5xl p-4">
			<MmrAsymmetryConfigTable />
		</div>
	),
};
