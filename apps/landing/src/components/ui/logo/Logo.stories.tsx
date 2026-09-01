import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
	title: "UI/Logo",
	component: Logo,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["dark", "light"],
			description:
				"'dark' uses white marks (for dark backgrounds); 'light' uses dark marks (for light backgrounds)",
		},
	},
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Logo>;

/** Dark canvas: tokens + local `.dark` so it stays dark in the light toolbar. */
const darkCanvasFull = "dark w-[280px] rounded-md bg-bg-base px-6 py-8";
const darkCanvasMini = "dark w-20 rounded-md bg-bg-base px-4 py-6";
const darkCanvasOverview = "dark w-[280px] rounded-[10px] bg-bg-base px-5 py-6";
const darkCanvasOverviewMini = "dark w-20 rounded-[10px] bg-bg-base px-4 py-5";

/**
 * Light contrast canvas stays resolved. `--color-bg-base` inherits from
 * `html.dark` (Storybook default), which would hide the dark logo mark.
 */
const lightCanvasStyle = {
	background: "#ffffff",
	border: "1px solid #e4e4e9",
} as const;

// --- Full wordmark stories (container wide enough to show full logo) ---

export const Dark: Story = {
	args: { variant: "dark" },
	decorators: [
		(Story) => (
			<div className={darkCanvasFull}>
				<Story />
			</div>
		),
	],
};

export const Light: Story = {
	args: { variant: "light" },
	decorators: [
		(Story) => (
			<div className="w-[280px] rounded-md px-6 py-8" style={lightCanvasStyle}>
				<Story />
			</div>
		),
	],
};

// --- Mini (icon-only) stories — container narrower than 160px breakpoint ---

export const DarkMini: Story = {
	name: "Dark — Mini",
	args: { variant: "dark" },
	decorators: [
		(Story) => (
			<div className={darkCanvasMini}>
				<Story />
			</div>
		),
	],
};

export const LightMini: Story = {
	name: "Light — Mini",
	args: { variant: "light" },
	decorators: [
		(Story) => (
			<div className="w-20 rounded-md px-4 py-6" style={lightCanvasStyle}>
				<Story />
			</div>
		),
	],
};

// --- Side-by-side overview ---

export const AllVariants: Story = {
	name: "All Variants",
	render: () => (
		<div className="grid gap-6">
			<div className="flex items-center gap-6">
				{/* Full — dark */}
				<div className={darkCanvasOverview}>
					<Logo variant="dark" />
				</div>
				{/* Mini — dark */}
				<div className={darkCanvasOverviewMini}>
					<Logo variant="dark" />
				</div>
			</div>
			<div className="flex items-center gap-6">
				{/* Full — light */}
				<div
					className="w-[280px] rounded-[10px] px-5 py-6"
					style={lightCanvasStyle}
				>
					<Logo variant="light" />
				</div>
				{/* Mini — light */}
				<div className="w-20 rounded-[10px] px-4 py-5" style={lightCanvasStyle}>
					<Logo variant="light" />
				</div>
			</div>
		</div>
	),
};
