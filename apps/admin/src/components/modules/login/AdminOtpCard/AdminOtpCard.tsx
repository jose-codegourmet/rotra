"use client";

import Link from "next/link";
import { ADMIN_APP_DISPLAY_NAME, ROUTES } from "@/constants/admin";
import { AdminOtpForm } from "../AdminOtpForm/AdminOtpForm";

type AdminOtpCardProps = {
	email: string;
	nextPath: string;
};

export function AdminOtpCard({ email, nextPath }: AdminOtpCardProps) {
	return (
		<div className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-modal sm:p-8">
			<header className="space-y-2">
				<h2 className="text-title text-text-primary">
					{ADMIN_APP_DISPLAY_NAME}
				</h2>
				<p className="text-body text-text-secondary">
					Enter the one-time code sent to{" "}
					<span className="text-text-primary">{email}</span>.
				</p>
			</header>

			<AdminOtpForm email={email} nextPath={nextPath} />

			<Link
				href={`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}`}
				className="mt-5 block text-center text-small text-text-secondary underline-offset-4 transition-colors duration-default hover:text-text-primary hover:underline"
			>
				Use a different email
			</Link>

			<p className="mt-6 text-center text-micro uppercase tracking-wider text-text-disabled">
				Internal use only — sessions expire after 4 hours idle
			</p>
		</div>
	);
}

AdminOtpCard.displayName = "AdminOtpCard";
