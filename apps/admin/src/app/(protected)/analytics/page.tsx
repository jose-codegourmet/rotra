import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import {
	MOCK_ANALYTICS_KPIS,
	MOCK_TOP_CLUBS,
} from "@/constants/mock-admin-pages";
import { cn } from "@/lib/utils";

const SESSION_VOLUME_BARS = [
	{ label: "Mon", pct: 42 },
	{ label: "Tue", pct: 55 },
	{ label: "Wed", pct: 48 },
	{ label: "Thu", pct: 72 },
	{ label: "Fri", pct: 88 },
	{ label: "Sat", pct: 100 },
	{ label: "Sun", pct: 76 },
];

export default function AnalyticsPage() {
	return (
		<div className="mx-auto max-w-5xl space-y-10">
			<PageSection
				title="Key metrics"
				description="Mock deltas for layout — replace with real aggregates later."
			>
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{MOCK_ANALYTICS_KPIS.map((k) => (
						<div
							key={k.id}
							className="rounded-lg border border-border bg-bg-surface p-5"
						>
							<p className="text-label uppercase text-text-secondary">
								{k.label}
							</p>
							<p className="mt-2 text-display text-text-primary">{k.value}</p>
							<p
								className={cn(
									"mt-1 text-small font-medium",
									k.positive ? "text-accent" : "text-error",
								)}
							>
								{k.change}
							</p>
						</div>
					))}
				</div>
			</PageSection>

			<PageSection
				title="Session volume (7d)"
				description="CSS-only bar chart placeholder — no chart library."
			>
				<div className="flex h-52 items-end gap-2 rounded-lg border border-border bg-bg-surface px-4 pb-4 pt-4">
					{SESSION_VOLUME_BARS.map((b) => (
						<div
							key={b.label}
							className="flex h-44 flex-1 flex-col items-center justify-end gap-2"
						>
							<div
								className="w-full max-w-[3rem] rounded-t-sm bg-accent/35"
								style={{ height: `${(b.pct / 100) * 9}rem` }}
								title={`${b.pct}%`}
							/>
							<span className="text-micro uppercase text-text-disabled">
								{b.label}
							</span>
						</div>
					))}
				</div>
			</PageSection>

			<PageSection
				title="Top clubs by sessions"
				description="Ranked from mock data."
			>
				<PageTable minWidthClassName="min-w-[640px]">
					<thead>
						<tr className="border-b border-border bg-bg-base">
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Rank
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Club
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Sessions (7d)
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Players
							</th>
						</tr>
					</thead>
					<tbody>
						{MOCK_TOP_CLUBS.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
							>
								<td className="px-4 py-3 text-text-secondary">{row.rank}</td>
								<td className="px-4 py-3 font-medium text-text-primary">
									{row.name}
								</td>
								<td className="px-4 py-3 text-text-secondary">
									{row.sessions7d.toLocaleString()}
								</td>
								<td className="px-4 py-3 text-text-secondary">
									{row.players.toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</PageTable>
			</PageSection>
		</div>
	);
}
