import type { Meta, StoryObj } from "@storybook/react";

import { Field, FieldLabel } from "./field";
import { NativeSelect, NativeSelectOption } from "./native-select";

const meta: Meta<typeof NativeSelect> = {
	title: "shadcn/NativeSelect",
	component: NativeSelect,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
	render: () => (
		<Field>
			<FieldLabel htmlFor="native-fruit">Fruit</FieldLabel>
			<NativeSelect id="native-fruit" defaultValue="">
				<NativeSelectOption value="">Select a fruit</NativeSelectOption>
				<NativeSelectOption value="apple">Apple</NativeSelectOption>
				<NativeSelectOption value="banana">Banana</NativeSelectOption>
			</NativeSelect>
		</Field>
	),
};

export const Disabled: Story = {
	render: () => (
		<Field>
			<FieldLabel htmlFor="native-disabled">Status</FieldLabel>
			<NativeSelect id="native-disabled" disabled defaultValue="open">
				<NativeSelectOption value="open">Open</NativeSelectOption>
				<NativeSelectOption value="closed">Closed</NativeSelectOption>
			</NativeSelect>
		</Field>
	),
};

export const Invalid: Story = {
	render: () => (
		<Field data-invalid>
			<FieldLabel htmlFor="native-invalid">Priority</FieldLabel>
			<NativeSelect id="native-invalid" aria-invalid defaultValue="">
				<NativeSelectOption value="">Choose…</NativeSelectOption>
				<NativeSelectOption value="p1">P1</NativeSelectOption>
			</NativeSelect>
		</Field>
	),
};
