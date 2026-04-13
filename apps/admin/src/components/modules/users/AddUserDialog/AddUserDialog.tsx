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
import type {
	AdminUserRow,
	AdminUserStatus,
} from "@/constants/mock-admin-users";

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent";

export function AddUserDialog({
	onUserAdded,
}: {
	onUserAdded: (user: AdminUserRow) => void;
}) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [role, setRole] = React.useState("Admin");
	const [status, setStatus] = React.useState<AdminUserStatus>("active");

	function resetForm() {
		setName("");
		setEmail("");
		setRole("Admin");
		setStatus("active");
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		if (!trimmedName || !trimmedEmail) return;

		const today = new Date().toISOString().slice(0, 10);
		onUserAdded({
			id: crypto.randomUUID(),
			name: trimmedName,
			email: trimmedEmail,
			role,
			status,
			lastActive: today,
		});
		resetForm();
		setOpen(false);
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
							Creates a mock row in this directory only — no API yet.
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
								onChange={(ev) => setRole(ev.target.value)}
							>
								<option value="Admin">Admin</option>
								<option value="Super admin">Super admin</option>
							</select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-label uppercase text-text-secondary">
								Status
							</span>
							<select
								className={inputClassName}
								value={status}
								onChange={(ev) => setStatus(ev.target.value as AdminUserStatus)}
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</label>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit">Save user</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
