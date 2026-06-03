"use client";

import { useQuery } from "@tanstack/react-query";
import { adminProfileQueryKey } from "./queryKey";
import { fetchAdminProfile } from "./server";

export function useAdminProfileQuery() {
	return useQuery({
		queryKey: adminProfileQueryKey,
		queryFn: fetchAdminProfile,
	});
}
