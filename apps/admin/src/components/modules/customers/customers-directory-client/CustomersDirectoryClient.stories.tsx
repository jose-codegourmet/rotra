import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MOCK_CUSTOMERS_LIST_RESPONSE } from "@/constants/mock-customers";
import { customersQueryKey } from "@/hooks/useCustomers/queryKey";

import { CustomersDirectoryClient } from "./CustomersDirectoryClient";

const filters = { q: "", page: 1, limit: 25 } as const;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 60_000,
		},
	},
});

queryClient.setQueryData(
	customersQueryKey({ ...filters }),
	MOCK_CUSTOMERS_LIST_RESPONSE,
);

const meta: Meta<typeof CustomersDirectoryClient> = {
	title: "modules/customers/CustomersDirectoryClient",
	component: CustomersDirectoryClient,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<Story />
			</QueryClientProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof CustomersDirectoryClient>;

export const Default: Story = {
	args: {
		initialFilters: { ...filters },
		initialList: MOCK_CUSTOMERS_LIST_RESPONSE,
	},
};
