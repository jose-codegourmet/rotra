import Link from "next/link";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { CountCard } from "@/components/custom/cards/count-card/CountCard";
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
	const attentionCards = [
		{
			title: "Pending owner approvals",
			count: pendingApprovals,
			tone: "accent" as const,
			href: ROUTES.APPROVALS,
			linkLabel: "Open approvals",
		},
		{
			title: "Open moderation items",
			count: openFlags,
			tone: "warning" as const,
			href: ROUTES.MODERATION,
			linkLabel: "Open moderation",
		},
	];

	return (
		<div className="mx-auto max-w-5xl space-y-10">
			<PageSection
				title="Platform overview"
				description="Snapshot from mock data — replace with live metrics when APIs exist."
			>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{MOCK_DASHBOARD_KPIS.map((kpi) => (
						<CountCard
							key={kpi.id}
							title={kpi.label}
							count={kpi.value}
							layout="kpi"
							subLabel={
								<p className="text-small text-text-disabled">{kpi.hint}</p>
							}
						/>
					))}
				</div>
			</PageSection>

			<div className="grid gap-8 lg:grid-cols-2">
				<PageSection
					title="Attention"
					description="Counts derived from the same mock lists used on Approvals and Moderation."
				>
					<div className="grid gap-3 sm:grid-cols-2">
						{attentionCards.map((card) => (
							<CountCard
								key={card.title}
								title={card.title}
								count={card.count}
								layout="attention"
								tone={card.tone}
								animateCount
								subLabel={
									<Link
										href={card.href}
										className="inline-block text-small text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
									>
										{card.linkLabel}
									</Link>
								}
							/>
						))}
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
