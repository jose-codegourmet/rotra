"use client";

import { ADMIN_APP_DISPLAY_NAME } from "@/constants/admin";
import { AdminLoginForm } from "../AdminLoginForm/AdminLoginForm";

type AdminLoginCardProps = {
	nextPath: string;
};

export function AdminLoginCard({ nextPath }: AdminLoginCardProps) {
	return (
		<div className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-modal sm:p-8">
			<header className="space-y-2">
				<h2 className="text-title text-text-primary">
					{ADMIN_APP_DISPLAY_NAME}
				</h2>
				<p className="text-body text-text-secondary">
					Sign in with your admin email. We will send a one-time passcode.
				</p>
			</header>

			<AdminLoginForm nextPath={nextPath} />

			<p className="mt-6 text-center text-micro uppercase tracking-wider text-text-disabled">
				Internal use only — sessions expire after 4 hours idle
			</p>
		</div>
	);
}

AdminLoginCard.displayName = "AdminLoginCard";
