"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
	clubApplicationNameCollisionsQueryKey,
	useApproveClubApplicationMutation,
	useClubApplicationNameCollisionsQuery,
	useClubApplicationsListQuery,
} from "@/hooks/useClubApplications/client";
import type { ClubApplicationListRowDto } from "@/types/club-application-admin";
import { ApplicationDetailPanel } from "./ApplicationDetailPanel";
import { ApplicationQueueTable } from "./ApplicationQueueTable";
import { ApprovalsPageLayout } from "./ApprovalsPageLayout";
import { ApproveConfirmModal } from "./ApproveConfirmModal";
import { BulkRejectToolbar } from "./BulkRejectToolbar";
import { ExportCsvButton } from "./ExportCsvButton";
import { RejectReasonFormModal } from "./RejectReasonFormModal";
import type { RejectReasonMutationTarget } from "./reject-reason-form/RejectReasonForm";

const PAGE_SIZE = 20;

export function ClubApplicationsApprovalsView() {
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<string | undefined>("pending");
	const [sort, setSort] = useState<string>("newest");
	const [playerId, setPlayerId] = useState<string | undefined>(undefined);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
	const [detailOpenMobile, setDetailOpenMobile] = useState(false);

	const [approveOpen, setApproveOpen] = useState(false);
	const [rejectOpen, setRejectOpen] = useState(false);
	const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
	const [rejectApplicationId, setRejectApplicationId] = useState<string | null>(
		null,
	);

	const listParams = useMemo(
		() => ({
			page: 1,
			pageSize: PAGE_SIZE,
			...(status !== undefined ? { status } : {}),
			sort,
			...(playerId ? { playerId } : {}),
		}),
		[status, sort, playerId],
	);

	const { data, isLoading, error, refetch } =
		useClubApplicationsListQuery(listParams);
	const approveMut = useApproveClubApplicationMutation(listParams);

	const collisionsQuery = useClubApplicationNameCollisionsQuery(selectedId);

	const rows = data?.rows ?? [];
	const selectedRow = useMemo(
		() => rows.find((r) => r.id === selectedId) ?? null,
		[rows, selectedId],
	);

	const actionableSelectedCount = useMemo(() => {
		let n = 0;
		for (const id of selectedIds) {
			const row = rows.find((r) => r.id === id);
			if (row && (row.status === "pending" || row.status === "in_review")) {
				n += 1;
			}
		}
		return n;
	}, [rows, selectedIds]);

	const toggleSelect = useCallback((id: string, selected: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (selected) next.add(id);
			else next.delete(id);
			return next;
		});
	}, []);

	const toggleSelectAllOnPage = useCallback(
		(ids: string[], selected: boolean) => {
			setSelectedIds((prev) => {
				const next = new Set(prev);
				for (const id of ids) {
					if (selected) next.add(id);
					else next.delete(id);
				}
				return next;
			});
		},
		[],
	);

	const onSelectRow = useCallback((row: ClubApplicationListRowDto) => {
		setSelectedId(row.id);
		setDetailOpenMobile(true);
	}, []);

	const busy = approveMut.isPending;

	const openRejectSingle = (id: string) => {
		setBulkRejectOpen(false);
		setRejectApplicationId(id);
		setRejectOpen(true);
	};

	const rejectMutationTarget = useMemo<RejectReasonMutationTarget>(() => {
		if (bulkRejectOpen) {
			const applicationIds = Array.from(selectedIds).filter((id) => {
				const row = rows.find((r) => r.id === id);
				return row && (row.status === "pending" || row.status === "in_review");
			});
			return { type: "bulk", applicationIds };
		}
		return {
			type: "single",
			applicationId: rejectApplicationId ?? "",
		};
	}, [bulkRejectOpen, selectedIds, rows, rejectApplicationId]);

	const handleRejectSuccess = () => {
		const lastRejectApplicationId = rejectApplicationId;
		const isBulk = bulkRejectOpen;
		setRejectOpen(false);
		setBulkRejectOpen(false);
		setRejectApplicationId(null);
		if (isBulk) {
			setSelectedIds(new Set());
		}
		if (lastRejectApplicationId) {
			void queryClient.invalidateQueries({
				queryKey: clubApplicationNameCollisionsQueryKey(
					lastRejectApplicationId,
				),
			});
		}
		void refetch();
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-heading font-bold text-text-primary">
						Club applications
					</h1>
					<p className="text-body text-text-secondary mt-1">
						Review pending requests. Approve or reject requires admin actor env
						or <code className="text-micro">X-Rotra-Admin-Profile-Id</code>.
					</p>
				</div>
				<ExportCsvButton rows={rows} disabled={isLoading} />
			</div>

			{playerId ? (
				<div className="flex flex-wrap items-center gap-2 text-small">
					<span className="text-text-secondary">
						Filtered by applicant{" "}
						<code className="text-micro text-text-primary">{playerId}</code>
					</span>
					<button
						type="button"
						className="text-accent font-bold uppercase tracking-widest text-micro underline-offset-2 hover:underline"
						onClick={() => setPlayerId(undefined)}
					>
						Clear filter
					</button>
				</div>
			) : null}

			<BulkRejectToolbar
				selectedCount={actionableSelectedCount}
				disabled={busy}
				onBulkReject={() => {
					setBulkRejectOpen(true);
					setRejectApplicationId(null);
					setRejectOpen(true);
				}}
			/>

			<ApprovalsPageLayout
				detailOpen={detailOpenMobile && Boolean(selectedRow)}
				onCloseDetail={() => setDetailOpenMobile(false)}
				queue={
					<ApplicationQueueTable
						rows={rows}
						isLoading={isLoading}
						error={error as Error | null}
						selectedId={selectedId}
						sort={sort}
						onSortChange={setSort}
						status={status}
						onStatusChange={setStatus}
						selectedIds={selectedIds}
						onToggleSelect={toggleSelect}
						onToggleSelectAllOnPage={toggleSelectAllOnPage}
						onSelectRow={onSelectRow}
						onRefresh={() => void refetch()}
					/>
				}
				detail={
					<ApplicationDetailPanel
						row={selectedRow}
						collisions={collisionsQuery.data?.clubs ?? []}
						collisionsLoading={collisionsQuery.isFetching}
						onApprove={() => setApproveOpen(true)}
						onReject={() => {
							if (selectedRow) openRejectSingle(selectedRow.id);
						}}
						onFilterByApplicant={(pid) => {
							setPlayerId(pid);
							setStatus(undefined);
							void refetch();
						}}
						actionsDisabled={busy}
					/>
				}
			/>

			<ApproveConfirmModal
				open={approveOpen}
				onOpenChange={setApproveOpen}
				clubName={selectedRow?.clubName ?? ""}
				applicantName={selectedRow?.applicantName ?? ""}
				busy={approveMut.isPending}
				onConfirm={() => {
					if (!selectedRow) return;
					approveMut.mutate(selectedRow.id, {
						onSuccess: () => {
							setApproveOpen(false);
							void refetch();
						},
					});
				}}
			/>

			<RejectReasonFormModal
				open={rejectOpen}
				onOpenChange={(open) => {
					setRejectOpen(open);
					if (!open) {
						setBulkRejectOpen(false);
						setRejectApplicationId(null);
					}
				}}
				title={
					bulkRejectOpen ? "Reject selected applications" : "Reject application"
				}
				mutationTarget={rejectMutationTarget}
				onSuccess={handleRejectSuccess}
				onError={() => {}}
			/>
		</div>
	);
}
