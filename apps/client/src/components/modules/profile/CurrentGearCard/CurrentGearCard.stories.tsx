import type { Meta, StoryObj } from "@storybook/react";

import { MOCK_PLAYER } from "@/constants/mock-player";

import { CurrentGearCard } from "./CurrentGearCard";

const meta: Meta<typeof CurrentGearCard> = {
	title: "profile/CurrentGearCard",
	component: CurrentGearCard,
	tags: ["autodocs"],
	argTypes: {
		player: { control: "object" },
	},
};

export default meta;
type Story = StoryObj<typeof CurrentGearCard>;

export const Default: Story = {
	args: {
		player: MOCK_PLAYER,
	},
};

export const NoGear: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			gear: [
				{ category: "RACKETS", items: [] },
				{ category: "FOOTWEAR", items: [] },
				{ category: "BAGS", items: [] },
			],
		},
	},
};

export const FullKit: Story = {
	args: {
		player: {
			...MOCK_PLAYER,
			gear: [
				{
					category: "RACKETS",
					items: [
						{
							title: "Main Racket",
							brand: "Yonex",
							model: "Astrox 99 Pro",
							specs: ["Head Heavy", "BG80", "26 lbs"],
						},
						{
							title: "Backup Racket",
							brand: "Victor",
							model: "Thruster K 9900",
							specs: ["Head Heavy", "BG65", "28 lbs"],
						},
					],
				},
				{
					category: "FOOTWEAR",
					items: [
						{
							title: "Court Shoes",
							brand: "Yonex",
							model: "Power Cushion 65 Z3",
							specs: ["Wide Fit", "Size 9.5"],
						},
					],
				},
				{
					category: "BAGS",
					items: [
						{
							title: "Tournament Bag",
							brand: "Li-Ning",
							model: "ABJS014",
							specs: ["6-racket capacity"],
						},
					],
				},
			],
		},
	},
};
