"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button/Button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./DropdownMenu";

function DropdownMenuDemo() {
	return (
		<div className="flex min-h-[200px] items-start justify-center p-8">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="outline">
						Open menu
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							More
							<ChevronRight className="ml-auto size-4" strokeWidth={1.5} />
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Documentation</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

const meta: Meta<typeof DropdownMenu> = {
	title: "shadcn/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
	render: () => <DropdownMenuDemo />,
};
