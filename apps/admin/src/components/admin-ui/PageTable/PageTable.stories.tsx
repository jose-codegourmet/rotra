import type { Meta, StoryObj } from "@storybook/react";
import { PageTable } from "./PageTable";

const meta: Meta<typeof PageTable> = {
	title: "admin-ui/PageTable",
	component: PageTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageTable>;

export const Default: Story = {
	render: () => (
		<PageTable>
			<thead>
				<tr className="border-b border-border bg-bg-base">
					<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
						Column A
					</th>
					<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
						Column B
					</th>
				</tr>
			</thead>
			<tbody>
				<tr className="border-b border-border last:border-0">
					<td className="px-4 py-3 text-text-primary">Alpha</td>
					<td className="px-4 py-3 text-text-secondary">One</td>
				</tr>
				<tr className="border-b border-border last:border-0">
					<td className="px-4 py-3 text-text-primary">Beta</td>
					<td className="px-4 py-3 text-text-secondary">Two</td>
				</tr>
			</tbody>
		</PageTable>
	),
};
