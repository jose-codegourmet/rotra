"use client";

import { configureStore } from "@reduxjs/toolkit";
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";
import type { DashboardViewMode } from "@/types/session-discovery";
import { ViewToggle } from "./ViewToggle";

function makeStore(dashboardViewMode: DashboardViewMode) {
	return configureStore({
		reducer: { auth: authReducer, ui: uiReducer },
		preloadedState: {
			auth: { user: null, initialized: true },
			ui: { isMobileDrawerOpen: false, dashboardViewMode },
		},
	});
}

const meta: Meta<typeof ViewToggle> = {
	title: "dashboard/ViewToggle",
	component: ViewToggle,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="relative min-h-[120px] bg-bg-base">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const MapActive: Story = {
	decorators: [
		(Story) => (
			<Provider store={makeStore("map")}>
				<Story />
			</Provider>
		),
	],
};

export const ListActive: Story = {
	decorators: [
		(Story) => (
			<Provider store={makeStore("list")}>
				<Story />
			</Provider>
		),
	],
};

export const GridActive: Story = {
	decorators: [
		(Story) => (
			<Provider store={makeStore("grid")}>
				<Story />
			</Provider>
		),
	],
};
