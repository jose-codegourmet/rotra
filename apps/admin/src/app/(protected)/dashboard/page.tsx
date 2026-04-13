import Link from "next/link";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { ADMIN_NAV_ITEMS, ROUTES } from "@/constants/admin";
import {
	MOCK_APPROVALS,
	MOCK_DASHBOARD_ACTIVITY,
	MOCK_DASHBOARD_KPIS,
	MOCK_MODERATION,
} from "@/constants/mock-admin-pages";

export default function DashboardPage() {
	const pendingApprovals = MOCK_APPROVALS.filter(
		(a) => a.status === "pending",
	).length;
	const openFlags = MOCK_MODERATION.filter((m) => m.status === "open").length;

	return (
		<div className="mx-auto max-w-5xl space-y-10">
			<PageSection
				title="Platform overview"
				description="Snapshot from mock data — replace with live metrics when APIs exist."
			>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{MOCK_DASHBOARD_KPIS.map((kpi) => (
						<div
							key={kpi.id}
							className="rounded-lg border border-border bg-bg-surface p-5 shadow-card"
						>
							<p className="text-label uppercase text-text-secondary">
								{kpi.label}
							</p>
							<p className="mt-2 text-display text-text-primary">{kpi.value}</p>
							<p className="mt-1 text-small text-text-disabled">{kpi.hint}</p>
						</div>
					))}
				</div>
			</PageSection>

			<div className="grid gap-8 lg:grid-cols-2">
				<PageSection
					title="Attention"
					description="Counts derived from the same mock lists used on Approvals and Moderation."
				>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-lg border border-border bg-bg-surface p-4">
							<p className="text-label uppercase text-text-secondary">
								Pending owner approvals
							</p>
							<p className="mt-2 text-title text-accent">{pendingApprovals}</p>
							<Link
								href={ROUTES.APPROVALS}
								className="mt-2 inline-block text-small text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
							>
								Open approvals
							</Link>
						</div>
						<div className="rounded-lg border border-border bg-bg-surface p-4">
							<p className="text-label uppercase text-text-secondary">
								Open moderation items
							</p>
							<p className="mt-2 text-title text-warning">{openFlags}</p>
							<Link
								href={ROUTES.MODERATION}
								className="mt-2 inline-block text-small text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
							>
								Open moderation
							</Link>
						</div>
					</div>
				</PageSection>

				<PageSection
					title="Recent activity"
					description="Audit-style feed (static copy)."
				>
					<ul className="divide-y divide-border rounded-lg border border-border bg-bg-surface">
						{MOCK_DASHBOARD_ACTIVITY.map((item) => (
							<li
								key={item.id}
								className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<p className="text-body text-text-primary">{item.summary}</p>
								<span className="text-small text-text-disabled">
									{item.time}
								</span>
							</li>
						))}
					</ul>
				</PageSection>
			</div>

			<PageSection
				title="All sections"
				description="Jump to any admin module from here or the sidebar."
			>
				<ul className="grid gap-2 sm:grid-cols-2">
					{ADMIN_NAV_ITEMS.filter((i) => i.href !== ROUTES.DASHBOARD).map(
						(item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="flex min-h-11 items-center rounded-md border border-border bg-bg-surface px-4 py-2 text-small text-text-primary transition-colors hover:border-border-strong hover:bg-bg-elevated"
								>
									{item.label}
								</Link>
							</li>
						),
					)}
				</ul>
			</PageSection>
		</div>
	);
}
