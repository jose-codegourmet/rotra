import type { TesterDirectoryStatus } from "@rotra/db";

export const testersRootKey = ["testers"] as const;

export type TestersListQueryFilters = {
	page: number;
	limit: number;
	status?: TesterDirectoryStatus;
};

export function testersListQueryKey(filters: TestersListQueryFilters) {
	return [...testersRootKey, "list", filters] as const;
}

export function testerDetailQueryKey(id: string) {
	return [...testersRootKey, "detail", id] as const;
}
