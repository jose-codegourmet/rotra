import { configureStore } from "@reduxjs/toolkit";
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { LogoutDialogProvider } from "@/hooks/logoutDialogProvider";
import uiReducer from "@/store/slices/uiSlice";
import { MobileDrawer } from "./MobileDrawer";

function makeStore(isMobileDrawerOpen: boolean) {
	return configureStore({
		reducer: { ui: uiReducer },
		preloadedState: { ui: { isMobileDrawerOpen } },
	});
}

const meta: Meta<typeof MobileDrawer> = {
	title: "Navigation/MobileDrawer",
	component: MobileDrawer,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<LogoutDialogProvider>
				<Story />
			</LogoutDialogProvider>
		),
	],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		activeItem: {
			control: "select",
			options: ["home", "clubs", "sessions", "profile"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof MobileDrawer>;

export const Closed: Story = {
	args: { activeItem: "home" },
	decorators: [
		(Story) => (
			<Provider store={makeStore(false)}>
				<Story />
			</Provider>
		),
	],
};

export const Open: Story = {
	args: { activeItem: "home" },
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};

export const OpenActiveClubs: Story = {
	args: { activeItem: "clubs" },
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};

export const OpenActiveSessions: Story = {
	args: { activeItem: "sessions" },
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};
