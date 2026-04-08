import { createSlice } from "@reduxjs/toolkit";

interface UIState {
	isMobileDrawerOpen: boolean;
}

const initialState: UIState = {
	isMobileDrawerOpen: false,
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		toggleMobileDrawer(state) {
			state.isMobileDrawerOpen = !state.isMobileDrawerOpen;
		},
		openMobileDrawer(state) {
			state.isMobileDrawerOpen = true;
		},
		closeMobileDrawer(state) {
			state.isMobileDrawerOpen = false;
		},
	},
});

export const { toggleMobileDrawer, openMobileDrawer, closeMobileDrawer } =
	uiSlice.actions;

export default uiSlice.reducer;
