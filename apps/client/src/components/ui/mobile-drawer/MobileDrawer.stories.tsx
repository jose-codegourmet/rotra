import { configureStore } from "@reduxjs/toolkit";
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { LogoutDialogProvider } from "@/hooks/logoutDialogProvider";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";
import { MobileDrawer } from "./MobileDrawer";

function makeStore(isMobileDrawerOpen: boolean) {
	return configureStore({
		reducer: { auth: authReducer, ui: uiReducer },
		preloadedState: {
			auth: { user: null, initialized: true },
			ui: { isMobileDrawerOpen },
		},
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
};

export default meta;
type Story = StoryObj<typeof MobileDrawer>;

export const Closed: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/dashboard" } },
	},
	decorators: [
		(Story) => (
			<Provider store={makeStore(false)}>
				<Story />
			</Provider>
		),
	],
};

export const Open: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/dashboard" } },
	},
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};

export const OpenActiveClubs: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/clubs" } },
	},
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};

export const OpenActiveSessions: Story = {
	parameters: {
		nextjs: { navigation: { pathname: "/sessions" } },
	},
	decorators: [
		(Story) => (
			<Provider store={makeStore(true)}>
				<Story />
			</Provider>
		),
	],
};
