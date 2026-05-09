"use client";

import { useQuery } from "@tanstack/react-query";
import type { CustomersQueryFilters } from "./queryKey";
import { customerDetailQueryKey, customersQueryKey } from "./queryKey";
import type { CustomerDetailResponse, ListCustomersResponse } from "./server";
import { fetchCustomerDetail, fetchCustomers } from "./server";

export { customerDetailQueryKey, customersQueryKey };

export function useCustomersQuery(
	filters: CustomersQueryFilters,
	options?: {
		initialData?: ListCustomersResponse;
	},
) {
	return useQuery({
		queryKey: customersQueryKey(filters),
		queryFn: () => fetchCustomers(filters),
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}

export function useCustomerDetailQuery(
	id: string,
	options?: {
		initialData?: CustomerDetailResponse;
		enabled?: boolean;
	},
) {
	return useQuery({
		queryKey: customerDetailQueryKey(id),
		queryFn: () => fetchCustomerDetail(id),
		enabled: options?.enabled ?? Boolean(id),
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}
