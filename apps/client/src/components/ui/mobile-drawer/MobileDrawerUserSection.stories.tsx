import { configureStore } from "@reduxjs/toolkit";
import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";
import { LogoutDialogProvider } from "@/hooks/logoutDialogProvider";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";
import { MobileDrawerUserSection } from "./MobileDrawerUserSection";

function makeStore() {
	return configureStore({
		reducer: { auth: authReducer, ui: uiReducer },
		preloadedState: {
			auth: { user: null, initialized: true },
			ui: { isMobileDrawerOpen: true },
		},
	});
}

const meta: Meta<typeof MobileDrawerUserSection> = {
	title: "Navigation/MobileDrawerUserSection",
	component: MobileDrawerUserSection,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<Provider store={makeStore()}>
				<LogoutDialogProvider>
					<div className="w-[360px] bg-bg-base">
						<Story />
					</div>
				</LogoutDialogProvider>
			</Provider>
		),
	],
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof MobileDrawerUserSection>;

export const Default: Story = {};

export const AdminRole: Story = {
	args: {
		adminRole: "admin",
	},
};

export const SuperAdminRole: Story = {
	args: {
		adminRole: "super_admin",
	},
};
