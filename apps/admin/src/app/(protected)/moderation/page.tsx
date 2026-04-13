import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import { Button } from "@/components/ui/button/Button";
import { MOCK_MODERATION } from "@/constants/mock-admin-pages";
import { cn } from "@/lib/utils";

function PriorityBadge({ p }: { p: "low" | "medium" | "high" }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				p === "high" && "border border-error/40 bg-error/10 text-error",
				p === "medium" &&
					"border border-warning/40 bg-bg-elevated text-warning",
				p === "low" &&
					"border border-border bg-bg-elevated text-text-secondary",
			)}
		>
			{p}
		</span>
	);
}

function StatusBadge({ s }: { s: "open" | "escalated" }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				s === "escalated"
					? "border border-error/40 text-error"
					: "border border-border text-text-secondary",
			)}
		>
			{s === "escalated" ? "Escalated" : "Open"}
		</span>
	);
}

export default function ModerationPage() {
	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Moderation queue"
				description="Flagged reviews, accounts, and announcements. Static rows for layout only."
			>
				<PageTable minWidthClassName="min-w-[900px]">
					<thead>
						<tr className="border-b border-border bg-bg-base">
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Type
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Target
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Reason
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Priority
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Status
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Opened
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{MOCK_MODERATION.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
							>
								<td className="px-4 py-3 text-text-primary">{row.type}</td>
								<td className="max-w-[220px] px-4 py-3 text-text-secondary">
									{row.target}
								</td>
								<td className="max-w-xs px-4 py-3 text-text-secondary">
									{row.reason}
								</td>
								<td className="px-4 py-3">
									<PriorityBadge p={row.priority} />
								</td>
								<td className="px-4 py-3">
									<StatusBadge s={row.status} />
								</td>
								<td className="px-4 py-3 text-text-secondary">
									{row.openedAt}
								</td>
								<td className="px-4 py-3">
									<div className="flex flex-wrap gap-2">
										<Button type="button" variant="secondary" size="sm">
											View
										</Button>
										<Button type="button" variant="outline" size="sm">
											Resolve
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</PageTable>
			</PageSection>
		</div>
	);
}
