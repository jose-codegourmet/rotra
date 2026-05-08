"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ListAdminUsersResponse } from "@/hooks/useAdminUsers/server";
import {
	deactivateAdminUserRequest,
	deleteAdminUserRequest,
	demoteSuperAdminToAdminRequest,
	fetchAdminUsers,
	forceSignOutAdminUserRequest,
	inviteAdminUserRequest,
	promoteAdminToSuperAdminRequest,
	reactivateAdminUserRequest,
	resendAdminInviteRequest,
} from "@/hooks/useAdminUsers/server";
import { adminUsersQueryKey } from "./queryKey";

export { adminUsersQueryKey };

export function useAdminUsersQuery(options?: {
	initialData?: ListAdminUsersResponse;
}) {
	return useQuery({
		queryKey: adminUsersQueryKey(),
		queryFn: fetchAdminUsers,
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}

export function useInviteAdminUserMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: {
			name: string;
			email: string;
			role: "admin" | "super_admin";
		}) => inviteAdminUserRequest(payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useResendAdminInviteMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => resendAdminInviteRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useDeactivateAdminUserMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => deactivateAdminUserRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useReactivateAdminUserMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => reactivateAdminUserRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function usePromoteAdminToSuperAdminMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => promoteAdminToSuperAdminRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useDemoteSuperAdminToAdminMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => demoteSuperAdminToAdminRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useForceSignOutAdminUserMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => forceSignOutAdminUserRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}

export function useDeleteAdminUserMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => deleteAdminUserRequest(userId),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: adminUsersQueryKey(),
			});
		},
	});
}
