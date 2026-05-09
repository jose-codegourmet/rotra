export type CustomersQueryFilters = {
	q: string;
	page: number;
	limit: number;
};

export function customersQueryKey(filters: CustomersQueryFilters) {
	return ["customers", "list", filters] as const;
}

export function customerDetailQueryKey(id: string) {
	return ["customers", "detail", id] as const;
}
