"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	approveClubApplicationRequest,
	bulkRejectClubApplicationsRequest,
	fetchClubApplicationNameCollisions,
	fetchClubApplicationsList,
	rejectClubApplicationRequest,
} from "@/hooks/useClubApplications/server";

export function clubApplicationsListQueryKey(params: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}) {
	return [
		"admin",
		"clubApplications",
		params.page,
		params.pageSize,
		params.status ?? "all",
		params.sort ?? "newest",
		params.playerId ?? "",
	] as const;
}

export function clubApplicationNameCollisionsQueryKey(applicationId: string) {
	return [
		"admin",
		"clubApplications",
		applicationId,
		"nameCollisions",
	] as const;
}

export function useClubApplicationsListQuery(params: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}) {
	return useQuery({
		queryKey: clubApplicationsListQueryKey(params),
		queryFn: () => fetchClubApplicationsList(params),
	});
}

export function useClubApplicationNameCollisionsQuery(
	applicationId: string | null,
) {
	return useQuery({
		queryKey: applicationId
			? clubApplicationNameCollisionsQueryKey(applicationId)
			: (["admin", "clubApplications", "nameCollisions", "none"] as const),
		queryFn: () => fetchClubApplicationNameCollisions(applicationId as string),
		enabled: Boolean(applicationId),
	});
}

export function useApproveClubApplicationMutation(listParams: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (applicationId: string) =>
			approveClubApplicationRequest(applicationId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: clubApplicationsListQueryKey(listParams),
			});
		},
	});
}

export function useRejectClubApplicationMutation(listParams: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (args: {
			applicationId: string;
			reason: string;
			reviewNote?: string | null;
		}) => rejectClubApplicationRequest(args),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: clubApplicationsListQueryKey(listParams),
			});
		},
	});
}

export function useBulkRejectClubApplicationsMutation(listParams: {
	page: number;
	pageSize: number;
	status?: string;
	sort?: string;
	playerId?: string;
}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (args: {
			applicationIds: string[];
			reason: string;
			reviewNote?: string | null;
		}) => bulkRejectClubApplicationsRequest(args),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: clubApplicationsListQueryKey(listParams),
			});
		},
	});
}
