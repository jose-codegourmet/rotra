"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { format } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button/Button";

import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function DatePickerDemo() {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<Button variant="outline" type="button">
					{date ? format(date, "PPP") : "Pick a date"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={(d) => {
						setDate(d);
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

const meta: Meta<typeof DatePickerDemo> = {
	title: "shadcn/DatePicker",
	component: DatePickerDemo,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePickerDemo>;

export const Default: Story = {
	render: () => <DatePickerDemo />,
};
