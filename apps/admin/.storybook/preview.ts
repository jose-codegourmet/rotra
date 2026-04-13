import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import { SATOSHI_FONT_STACK } from "./satoshi-font-stack";

const preview: Preview = {
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
		(Story) => {
			document.documentElement.style.setProperty(
				"--font-satoshi",
				SATOSHI_FONT_STACK,
			);
			document.documentElement.classList.add("dark");
			document.documentElement.style.backgroundColor = "#0b0b0c";
			return Story();
		},
	],
};

export default preview;
