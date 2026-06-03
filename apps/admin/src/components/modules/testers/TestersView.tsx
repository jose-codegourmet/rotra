"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { useTestersList } from "@/hooks/useTesters/client";
import type { TestersListQueryFilters } from "@/hooks/useTesters/queryKey";
import type { ListTestersResponse } from "@/hooks/useTesters/server";

import { InviteNewTesterDialog } from "./InviteNewTesterDialog";
import { TestersTable } from "./TestersTable";

const STATUS_OPTIONS = [
	{ value: "", label: "All statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "active", label: "Active" },
	{ value: "revoked", label: "Revoked" },
	{ value: "expired", label: "Expired" },
] as const;

export function TestersView({
	initialFilters,
	initialList,
}: {
	initialFilters: TestersListQueryFilters;
	initialList: ListTestersResponse;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const statusParam = searchParams.get("status");
	const filters: TestersListQueryFilters = {
		page: initialFilters.page,
		limit: initialFilters.limit,
		...(statusParam === "pending" ||
		statusParam === "active" ||
		statusParam === "revoked" ||
		statusParam === "expired"
			? { status: statusParam }
			: {}),
	};

	const useInitialList =
		filters.status === initialFilters.status &&
		filters.page === initialFilters.page;
	const { data, isLoading, isError } = useTestersList(
		filters,
		useInitialList ? { initialData: initialList } : {},
	);

	const rows = data?.rows ?? [];

	function onStatusChange(value: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set("status", value);
		else params.delete("status");
		router.push(`/testers?${params.toString()}`);
	}

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Testers"
				description="Invite and manage test player accounts without Facebook login."
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<label className="flex flex-col gap-1 text-label text-text-secondary">
						Status
						<select
							className="h-11 rounded-md border border-border bg-bg-elevated px-3 text-body"
							value={statusParam ?? ""}
							onChange={(e) => onStatusChange(e.target.value)}
						>
							{STATUS_OPTIONS.map((opt) => (
								<option key={opt.value || "all"} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</label>
					<InviteNewTesterDialog listFilters={filters} />
				</div>
			</PageSection>

			{isLoading ? (
				<p className="text-body text-text-secondary">Loading testers…</p>
			) : isError ? (
				<p className="text-body text-red-600">Failed to load testers.</p>
			) : (
				<TestersTable rows={rows} listFilters={filters} />
			)}
		</div>
	);
}
