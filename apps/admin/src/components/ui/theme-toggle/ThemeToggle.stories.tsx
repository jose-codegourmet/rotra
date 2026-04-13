"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
	title: "shadcn/ThemeToggle",
	component: ThemeToggle,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
				<Story />
			</ThemeProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
	render: () => (
		<div className="flex items-center gap-4 p-6">
			<ThemeToggle />
			<span className="text-small text-text-secondary">
				Click to toggle light / dark
			</span>
		</div>
	),
};
