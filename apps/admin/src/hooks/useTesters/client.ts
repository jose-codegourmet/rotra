"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { testerProfilePath } from "@/constants/admin";
import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";

import {
	type TestersListQueryFilters,
	testerDetailQueryKey,
	testersListQueryKey,
} from "./queryKey";
import type { ListTestersResponse, TesterDetailResponse } from "./server";
import {
	fetchTesterDetail,
	fetchTestersList,
	postInviteTester,
	postResendTesterInvite,
	postRevokeTesterInvite,
} from "./server";

export { testerDetailQueryKey, testersListQueryKey };

export function useTestersList(
	filters: TestersListQueryFilters,
	options?: { initialData?: ListTestersResponse },
) {
	return useQuery({
		queryKey: testersListQueryKey(filters),
		queryFn: () => fetchTestersList(filters),
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}

export function useTesterDetail(
	id: string,
	options?: { initialData?: TesterDetailResponse },
) {
	return useQuery({
		queryKey: testerDetailQueryKey(id),
		queryFn: () => fetchTesterDetail(id),
		enabled: Boolean(id),
		...(options?.initialData ? { initialData: options.initialData } : {}),
	});
}

export function useInviteTester(defaultListFilters: TestersListQueryFilters) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: postInviteTester,
		onSuccess: (data) => {
			toast.success("Tester invited.");
			void queryClient.invalidateQueries({
				queryKey: testersListQueryKey(defaultListFilters),
			});
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
			router.push(testerProfilePath(data.profileId));
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to invite tester.",
			);
		},
	});
}

export function useResendTesterInvite(
	profileId: string,
	listFilters: TestersListQueryFilters,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => postResendTesterInvite(profileId),
		onSuccess: () => {
			toast.success("Tester invite resent.");
			void queryClient.invalidateQueries({
				queryKey: testerDetailQueryKey(profileId),
			});
			void queryClient.invalidateQueries({
				queryKey: testersListQueryKey(listFilters),
			});
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to resend invite.",
			);
		},
	});
}

export function useRevokeTesterInvite(
	profileId: string,
	listFilters: TestersListQueryFilters,
) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: () => postRevokeTesterInvite(profileId),
		onSuccess: () => {
			toast.success("Tester invite revoked.");
			void queryClient.invalidateQueries({
				queryKey: testerDetailQueryKey(profileId),
			});
			void queryClient.invalidateQueries({
				queryKey: testersListQueryKey(listFilters),
			});
			void queryClient.invalidateQueries({
				queryKey: [...adminNotificationsRootKey],
			});
			router.push("/testers");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to revoke invite.",
			);
		},
	});
}
