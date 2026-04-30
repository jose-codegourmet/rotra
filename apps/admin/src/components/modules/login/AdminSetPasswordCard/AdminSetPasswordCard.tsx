"use client";

import { ADMIN_APP_DISPLAY_NAME } from "@/constants/admin";
import { AdminSetPasswordForm } from "../AdminSetPasswordForm/AdminSetPasswordForm";

export function AdminSetPasswordCard() {
	return (
		<div className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-modal sm:p-8">
			<header className="space-y-2">
				<h2 className="text-title text-text-primary">
					{ADMIN_APP_DISPLAY_NAME}
				</h2>
				<p className="text-body text-text-secondary">
					Set a password for your admin account before continuing.
				</p>
			</header>

			<AdminSetPasswordForm />

			<p className="mt-6 text-center text-micro uppercase tracking-wider text-text-disabled">
				Internal use only — sessions expire after 4 hours idle
			</p>
		</div>
	);
}

AdminSetPasswordCard.displayName = "AdminSetPasswordCard";
