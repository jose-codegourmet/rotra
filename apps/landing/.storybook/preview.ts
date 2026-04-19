import type { Preview } from "@storybook/react";
import { createElement } from "react";

import "../src/app/globals.css";
import { QueryProvider } from "../src/components/providers/QueryProvider";
import { SATOSHI_FONT_STACK } from "./satoshi-font-stack";

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Color theme",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: [{ value: "dark", icon: "moon", title: "Dark" }],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "dark",
	},
	parameters: {
		backgrounds: { disable: true },
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => createElement(QueryProvider, null, createElement(Story)),
		(Story) => {
			document.documentElement.style.setProperty(
				"--font-satoshi",
				SATOSHI_FONT_STACK,
			);
			return Story();
		},
		(Story) => {
			document.documentElement.classList.add("dark");
			document.documentElement.style.backgroundColor = "#0b0b0c";
			return Story();
		},
	],
};

export default preview;
