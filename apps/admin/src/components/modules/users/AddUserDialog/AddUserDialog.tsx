"use client";

import * as React from "react";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog/Dialog";
import type { AdminUserRole } from "../users.types";

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent";

export function AddUserDialog({
	onInvite,
}: {
	onInvite: (payload: {
		name: string;
		email: string;
		role: AdminUserRole;
	}) => Promise<void>;
}) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [role, setRole] = React.useState<AdminUserRole>("admin");
	const [submitting, setSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	function resetForm() {
		setName("");
		setEmail("");
		setRole("admin");
		setSubmitting(false);
		setError(null);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedEmail = email.trim().toLowerCase();
		if (!trimmedName || !trimmedEmail) return;
		setSubmitting(true);
		setError(null);
		try {
			await onInvite({ name: trimmedName, email: trimmedEmail, role });
			resetForm();
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to invite admin.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) resetForm();
			}}
		>
			<DialogTrigger asChild>
				<Button type="button">Add user</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add platform admin</DialogTitle>
						<DialogDescription>
							Invite a new admin account with role and email.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<label className="flex flex-col gap-1">
							<span className="text-label uppercase text-text-secondary">
								Name
							</span>
							<input
								className={inputClassName}
								value={name}
								onChange={(ev) => setName(ev.target.value)}
								placeholder="Full name"
								autoComplete="name"
								required
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-label uppercase text-text-secondary">
								Email
							</span>
							<input
								type="email"
								className={inputClassName}
								value={email}
								onChange={(ev) => setEmail(ev.target.value)}
								placeholder="name@company.com"
								autoComplete="email"
								required
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-label uppercase text-text-secondary">
								Role
							</span>
							<select
								className={inputClassName}
								value={role}
								onChange={(ev) => setRole(ev.target.value as AdminUserRole)}
							>
								<option value="admin">Admin</option>
								<option value="super_admin">Super admin</option>
							</select>
						</label>
						{error ? <p className="text-small text-danger">{error}</p> : null}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={submitting}>
							{submitting ? "Sending invite..." : "Send invite"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
