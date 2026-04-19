import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "./field";

const meta: Meta<typeof Checkbox> = {
	title: "shadcn/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	render: () => <Checkbox id="checkbox-default" />,
};

export const Disabled: Story = {
	render: () => <Checkbox id="checkbox-disabled" disabled />,
};

export const WithField: Story = {
	render: () => (
		<Field orientation="horizontal">
			<Checkbox id="terms" />
			<FieldContent>
				<FieldLabel htmlFor="terms">Accept terms</FieldLabel>
				<FieldDescription>You can change this later.</FieldDescription>
			</FieldContent>
		</Field>
	),
};

export const Invalid: Story = {
	render: () => (
		<Field data-invalid orientation="horizontal">
			<Checkbox id="checkbox-invalid" aria-invalid />
			<FieldContent>
				<FieldLabel htmlFor="checkbox-invalid">Required</FieldLabel>
			</FieldContent>
		</Field>
	),
};
