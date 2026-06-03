"use client";

import type { AdminRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input/Input";
import { ROUTES } from "@/constants/admin";
import { deleteAdminAccount } from "@/hooks/useAdminProfile/server";
import { createClient } from "@/lib/supabase/client";

export type DeleteAdminAccountSectionProps = {
	email: string;
	adminRole: AdminRole;
};

function formatAdminRole(role: AdminRole): string {
	return role === "super_admin" ? "Super Admin" : "Platform Admin";
}

export function DeleteAdminAccountSection({
	email,
	adminRole,
}: DeleteAdminAccountSectionProps) {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [confirmEmail, setConfirmEmail] = useState("");
	const supabase = createClient();

	const mutation = useMutation({
		mutationFn: deleteAdminAccount,
		onSuccess: async () => {
			toast.success("Account deleted.");
			setDialogOpen(false);
			await supabase.auth.signOut();
			router.replace(ROUTES.LOGIN);
			router.refresh();
		},
		onError: (error) => {
			const safeMessage =
				error instanceof Error
					? error.message
					: "Unable to delete account right now.";
			toast.error(safeMessage);
		},
	});

	const isPending = mutation.isPending;
	const emailMatches =
		confirmEmail.trim().toLowerCase() === email.trim().toLowerCase();

	function handleOpenChange(open: boolean) {
		if (isPending) return;
		setDialogOpen(open);
		if (!open) {
			setConfirmEmail("");
		}
	}

	return (
		<div className="rounded-lg border border-danger/40 bg-bg-surface p-5">
			<h3 className="text-body font-medium text-text-primary">Danger zone</h3>
			<p className="mt-1 text-small text-text-secondary">
				Permanently delete your admin account ({formatAdminRole(adminRole)}).
				This action cannot be undone.
			</p>
			<Button
				type="button"
				variant="destructive"
				className="mt-4"
				onClick={() => setDialogOpen(true)}
			>
				Delete account
			</Button>

			<Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Delete your admin account?</DialogTitle>
						<DialogDescription>
							This permanently removes your admin access and signs you out. Type
							your email address to confirm.
						</DialogDescription>
					</DialogHeader>

					<Field>
						<FieldLabel htmlFor="delete-admin-confirm-email">
							Confirm email
						</FieldLabel>
						<FieldContent>
							<Input
								id="delete-admin-confirm-email"
								type="email"
								autoComplete="off"
								value={confirmEmail}
								onChange={(event) => setConfirmEmail(event.target.value)}
								placeholder={email}
								disabled={isPending}
							/>
						</FieldContent>
					</Field>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={isPending || !emailMatches}
							onClick={() => {
								if (isPending || !emailMatches) return;
								mutation.mutate();
							}}
						>
							{isPending ? (
								<>
									<Loader2 className="size-4 animate-spin" aria-hidden />
									<span className="sr-only">Deleting account</span>
								</>
							) : (
								"Delete account"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

DeleteAdminAccountSection.displayName = "DeleteAdminAccountSection";
