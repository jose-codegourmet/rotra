"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/DropdownMenu";
import { adminDirectoryDetailPath } from "@/constants/admin";
import {
	useDeactivateAdminUserMutation,
	useDemoteSuperAdminToAdminMutation,
	useForceSignOutAdminUserMutation,
	usePromoteAdminToSuperAdminMutation,
	useReactivateAdminUserMutation,
	useResendAdminInviteMutation,
} from "@/hooks/useAdminUsers/client";
import type { AdminUserRow } from "../users.types";

export type AdminUserAction =
	| "resend-invite"
	| "deactivate"
	| "reactivate"
	| "promote-super-admin"
	| "demote-admin"
	| "force-signout";

const ADMIN_USER_ACTION = {
	RESEND_INVITE: "resend-invite",
	DEACTIVATE: "deactivate",
	REACTIVATE: "reactivate",
	PROMOTE_SUPER_ADMIN: "promote-super-admin",
	DEMOTE_ADMIN: "demote-admin",
	FORCE_SIGNOUT: "force-signout",
} as const satisfies Record<string, AdminUserAction>;

type AdminUserTableCellActionsProps = {
	user: AdminUserRow;
	canManageUsers: boolean;
	onActionError?: (message: string | null) => void;
};

export function AdminUserTableCellActions({
	user,
	canManageUsers,
	onActionError,
}: AdminUserTableCellActionsProps) {
	const [actionInFlight, setActionInFlight] = React.useState<string | null>(
		null,
	);
	const resendInviteMutation = useResendAdminInviteMutation();
	const deactivateMutation = useDeactivateAdminUserMutation();
	const reactivateMutation = useReactivateAdminUserMutation();
	const promoteMutation = usePromoteAdminToSuperAdminMutation();
	const demoteMutation = useDemoteSuperAdminToAdminMutation();
	const forceSignOutMutation = useForceSignOutAdminUserMutation();

	const actionOptions = React.useMemo(
		() =>
			[
				{
					id: ADMIN_USER_ACTION.RESEND_INVITE,
					label: "Resend invite",
					visible: user.status === "invited",
					errorMessage: "Failed to resend invite.",
					run: (userId: string) => resendInviteMutation.mutateAsync(userId),
				},
				{
					id: ADMIN_USER_ACTION.DEACTIVATE,
					label: "Deactivate",
					visible: user.status === "active",
					errorMessage: "Failed to deactivate admin.",
					run: (userId: string) => deactivateMutation.mutateAsync(userId),
				},
				{
					id: ADMIN_USER_ACTION.FORCE_SIGNOUT,
					label: "Force sign-out",
					visible: user.status === "active",
					errorMessage: "Failed to force sign-out.",
					run: (userId: string) => forceSignOutMutation.mutateAsync(userId),
				},
				{
					id: ADMIN_USER_ACTION.REACTIVATE,
					label: "Reactivate",
					visible: user.status === "inactive",
					errorMessage: "Failed to reactivate admin.",
					run: (userId: string) => reactivateMutation.mutateAsync(userId),
				},
				{
					id: ADMIN_USER_ACTION.PROMOTE_SUPER_ADMIN,
					label: "Promote to super admin",
					visible: user.adminRole === "admin",
					errorMessage: "Failed to promote admin.",
					run: (userId: string) => promoteMutation.mutateAsync(userId),
				},
				{
					id: ADMIN_USER_ACTION.DEMOTE_ADMIN,
					label: "Demote to admin",
					visible: user.adminRole === "super_admin",
					errorMessage: "Failed to demote admin.",
					run: (userId: string) => demoteMutation.mutateAsync(userId),
				},
			] as Array<{
				id: AdminUserAction;
				label: string;
				visible: boolean;
				errorMessage: string;
				run: (userId: string) => Promise<void>;
			}>,
		[
			deactivateMutation,
			demoteMutation,
			forceSignOutMutation,
			promoteMutation,
			reactivateMutation,
			resendInviteMutation,
			user.adminRole,
			user.status,
		],
	);

	const runAction = React.useCallback(
		async (action: AdminUserAction) => {
			const option = actionOptions.find((item) => item.id === action);
			if (!option) return;

			setActionInFlight(user.id);
			onActionError?.(null);
			try {
				await option.run(user.id);
			} catch (err) {
				onActionError?.(
					err instanceof Error ? err.message : option.errorMessage,
				);
			} finally {
				setActionInFlight(null);
			}
		},
		[actionOptions, onActionError, user.id],
	);

	return (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						aria-label="Row actions"
					>
						<MoreHorizontal className="size-4" strokeWidth={1.5} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={adminDirectoryDetailPath(user.id)}>View details</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							void navigator.clipboard.writeText(user.email);
						}}
					>
						Copy email
					</DropdownMenuItem>
					{canManageUsers &&
						actionOptions
							.filter((option) => option.visible)
							.map((option) => (
								<DropdownMenuItem
									key={option.id}
									disabled={actionInFlight === user.id}
									onClick={() => void runAction(option.id)}
								>
									{option.label}
								</DropdownMenuItem>
							))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
