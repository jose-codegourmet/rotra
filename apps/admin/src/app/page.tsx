import Link from "next/link";
import {
	ADMIN_APP_DISPLAY_NAME,
	ADMIN_NAV_ITEMS,
	ROUTES,
} from "@/constants/admin";

const hubExtras = [{ href: ROUTES.LOGIN, label: "Login" }] as const;

export default function AdminHubPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-bg-base px-6 py-12">
			<div className="max-w-lg text-center">
				<h1 className="text-display text-text-primary">
					{ADMIN_APP_DISPLAY_NAME}
				</h1>
				<p className="mt-3 text-body text-text-secondary">
					Static pages only — no APIs. Open shell routes or login below.
				</p>
			</div>
			<nav className="flex max-w-2xl flex-wrap items-center justify-center gap-3">
				{hubExtras.map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						className="flex min-h-12 items-center justify-center rounded-md border border-border-strong bg-bg-surface px-4 text-small font-medium text-text-primary transition-colors duration-default hover:bg-bg-elevated"
					>
						{label}
					</Link>
				))}
				{ADMIN_NAV_ITEMS.map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						className="flex min-h-12 items-center justify-center rounded-md border border-border bg-bg-surface px-4 text-small font-medium text-text-secondary transition-colors duration-default hover:border-border-strong hover:text-text-primary"
					>
						{label}
					</Link>
				))}
			</nav>
		</main>
	);
}
