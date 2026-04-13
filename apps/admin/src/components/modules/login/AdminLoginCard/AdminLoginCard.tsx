import { Button } from "@/components/ui/button/Button";
import { ADMIN_APP_DISPLAY_NAME } from "@/constants/admin";

export function AdminLoginCard() {
	return (
		<div className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-modal sm:p-8">
			<header className="space-y-2">
				<h2 className="text-title text-text-primary">
					{ADMIN_APP_DISPLAY_NAME}
				</h2>
				<p className="text-body text-text-secondary">
					Sign in with your platform credentials. Authenticator code required
					after email and password.
				</p>
			</header>

			<div className="mt-8 space-y-5">
				<div className="space-y-2">
					<label
						htmlFor="admin-email"
						className="text-label uppercase text-text-secondary"
					>
						Email
					</label>
					<input
						id="admin-email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="you@organization.com"
						className="h-12 w-full rounded-md border border-border bg-bg-elevated px-4 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="admin-password"
						className="text-label uppercase text-text-secondary"
					>
						Password
					</label>
					<input
						id="admin-password"
						name="password"
						type="password"
						autoComplete="current-password"
						placeholder="••••••••"
						className="h-12 w-full rounded-md border border-border bg-bg-elevated px-4 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="admin-totp"
						className="text-label uppercase text-text-secondary"
					>
						Authenticator code
					</label>
					<input
						id="admin-totp"
						name="totp"
						type="text"
						inputMode="numeric"
						autoComplete="one-time-code"
						placeholder="000 000"
						className="h-12 w-full rounded-md border border-border bg-bg-elevated px-4 text-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-accent"
					/>
				</div>

				<Button
					type="button"
					variant="default"
					className="min-h-12 w-full shadow-accent"
				>
					Sign in
				</Button>
			</div>

			<p className="mt-6 text-center text-micro uppercase tracking-wider text-text-disabled">
				Internal use only — sessions expire after 4 hours idle
			</p>
		</div>
	);
}

AdminLoginCard.displayName = "AdminLoginCard";
