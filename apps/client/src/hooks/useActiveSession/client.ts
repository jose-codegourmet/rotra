"use client";

import { useQuery } from "@tanstack/react-query";
import { activeSessionQueryKey } from "./queryKey";
import { fetchActiveSession } from "./server";

export { activeSessionQueryKey };

export function useActiveSession() {
	return useQuery({
		queryKey: activeSessionQueryKey,
		queryFn: fetchActiveSession,
		refetchInterval: 30_000,
		refetchOnWindowFocus: true,
	});
}
