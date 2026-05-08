import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginAdminCard } from "./login-admin-card/LoginAdminCard";

const meta: Meta<typeof LoginAdminCard> = {
	title: "Modules/Auth/LoginAdminCard",
	component: LoginAdminCard,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => {
			const queryClient = new QueryClient();
			return (
				<QueryClientProvider client={queryClient}>
					<div className="w-full max-w-[420px] bg-black p-6">
						<Story />
					</div>
				</QueryClientProvider>
			);
		},
	],
};

export default meta;

type Story = StoryObj<typeof LoginAdminCard>;

export const GateStep: Story = {
	args: {
		gateUnlockedInitially: false,
	},
};

export const CredentialsStep: Story = {
	args: {
		gateUnlockedInitially: true,
	},
};
