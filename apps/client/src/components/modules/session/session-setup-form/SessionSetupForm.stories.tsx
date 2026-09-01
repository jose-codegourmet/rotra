"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MOCK_SESSION_SETUP_VALUES } from "@/constants/mock-session-setup";
import { SessionSetupForm } from "./SessionSetupForm";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
}

function FormStory({
	initialValues,
}: {
	initialValues?: Partial<typeof MOCK_SESSION_SETUP_VALUES>;
}) {
	return (
		<QueryClientProvider client={makeQueryClient()}>
			<SessionSetupForm
				initialValues={initialValues}
				onSuccess={() => undefined}
				onError={() => undefined}
			/>
		</QueryClientProvider>
	);
}

const meta: Meta<typeof SessionSetupForm> = {
	title: "session/SessionSetupForm",
	component: SessionSetupForm,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof SessionSetupForm>;

export const Default: Story = {
	render: () => <FormStory initialValues={MOCK_SESSION_SETUP_VALUES} />,
};

export const Singles: Story = {
	render: () => (
		<FormStory
			initialValues={{ ...MOCK_SESSION_SETUP_VALUES, format: "singles" }}
		/>
	),
};
