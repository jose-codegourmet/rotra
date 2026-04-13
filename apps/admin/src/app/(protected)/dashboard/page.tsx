import Link from "next/link";
import { ADMIN_NAV_ITEMS, ROUTES } from "@/constants/admin";

export default function DashboardPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-4">
			<div className="rounded-lg border border-border bg-bg-surface p-6 shadow-card">
				<h2 className="text-heading text-text-primary">Platform overview</h2>
				<p className="mt-2 text-body text-text-secondary">
					Static placeholder. Use the sidebar or links below to open each
					section.
				</p>
				<ul className="mt-4 flex flex-col gap-2 text-small">
					{ADMIN_NAV_ITEMS.filter((i) => i.href !== ROUTES.DASHBOARD).map(
						(item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="text-accent underline-offset-2 hover:underline"
								>
									{item.label}
								</Link>
							</li>
						),
					)}
				</ul>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="rounded-lg border border-border bg-bg-surface p-5">
					<p className="text-label uppercase text-text-secondary">
						Active clubs
					</p>
					<p className="mt-2 text-display text-text-primary">—</p>
				</div>
				<div className="rounded-lg border border-border bg-bg-surface p-5">
					<p className="text-label uppercase text-text-secondary">
						Sessions (7d)
					</p>
					<p className="mt-2 text-display text-text-primary">—</p>
				</div>
			</div>
		</div>
	);
}
