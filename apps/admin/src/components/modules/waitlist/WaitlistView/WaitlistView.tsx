"use client";

import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import * as React from "react";

import { AdminWaitlistTable } from "@/components/modules/waitlist/AdminWaitlistTable/AdminWaitlistTable";
import { WaitlistLayout } from "@/components/modules/waitlist/WaitlistLayout/WaitlistLayout";
import { WaitlistStats } from "@/components/modules/waitlist/WaitlistStats/WaitlistStats";
import {
	WAITLIST_INITIAL_PAGE_INDEX,
	WAITLIST_INITIAL_PAGE_SIZE,
	type WaitlistApiResponse,
	type WaitlistStatsResponse,
	waitlistQueryKeys,
} from "@/lib/waitlist-shared";

async function fetchWaitlistStats(): Promise<WaitlistStatsResponse> {
	const res = await fetch("/api/waitlist/stats");
	if (!res.ok) {
		const err = (await res.json().catch(() => null)) as {
			error?: string;
		} | null;
		throw new Error(err?.error ?? "Failed to load statistics.");
	}
	return res.json() as Promise<WaitlistStatsResponse>;
}

async function fetchWaitlistPage(
	pageIndex: number,
	pageSize: number,
): Promise<WaitlistApiResponse> {
	const page = pageIndex + 1;
	const params = new URLSearchParams({
		page: String(page),
		pageSize: String(pageSize),
	});
	const res = await fetch(`/api/waitlist?${params.toString()}`);
	if (!res.ok) {
		const err = (await res.json().catch(() => null)) as {
			error?: string;
		} | null;
		throw new Error(err?.error ?? "Failed to load waitlist.");
	}
	return res.json() as Promise<WaitlistApiResponse>;
}

export function WaitlistView() {
	const statsQuery = useQuery({
		queryKey: waitlistQueryKeys.stats(),
		queryFn: fetchWaitlistStats,
	});

	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: WAITLIST_INITIAL_PAGE_INDEX,
		pageSize: WAITLIST_INITIAL_PAGE_SIZE,
	});

	const pageQuery = useQuery({
		queryKey: waitlistQueryKeys.page(pagination.pageIndex, pagination.pageSize),
		queryFn: () => fetchWaitlistPage(pagination.pageIndex, pagination.pageSize),
	});

	const rows = pageQuery.data?.rows ?? [];
	const total = pageQuery.data?.total ?? 0;

	return (
		<WaitlistLayout
			stats={
				<WaitlistStats
					stats={statsQuery.data ?? null}
					isLoading={statsQuery.isLoading}
					isError={statsQuery.isError}
					error={statsQuery.error instanceof Error ? statsQuery.error : null}
				/>
			}
			table={
				<AdminWaitlistTable
					rows={rows}
					total={total}
					pagination={pagination}
					onPaginationChange={setPagination}
					isLoading={pageQuery.isLoading}
					isFetching={pageQuery.isFetching}
					isError={pageQuery.isError}
					error={pageQuery.error instanceof Error ? pageQuery.error : null}
				/>
			}
		/>
	);
}

WaitlistView.displayName = "WaitlistView";
