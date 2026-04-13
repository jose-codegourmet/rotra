import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import { Button } from "@/components/ui/button/Button";
import { MOCK_APPROVALS } from "@/constants/mock-admin-pages";
import { cn } from "@/lib/utils";

function StatusPill({ status }: { status: "pending" | "in_review" }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				status === "pending"
					? "border border-warning/50 bg-bg-elevated text-warning"
					: "border border-border bg-bg-elevated text-text-secondary",
			)}
		>
			{status === "pending" ? "Pending" : "In review"}
		</span>
	);
}

export default function ApprovalsPage() {
	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Club owner applications"
				description="Queue of applicants requesting owner capabilities. Buttons are non-functional placeholders."
			>
				<PageTable minWidthClassName="min-w-[960px]">
					<thead>
						<tr className="border-b border-border bg-bg-base">
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Applicant
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Email
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Club
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								City
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Submitted
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Status
							</th>
							<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{MOCK_APPROVALS.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
							>
								<td className="px-4 py-3 font-medium text-text-primary">
									{row.applicantName}
								</td>
								<td className="px-4 py-3 text-text-secondary">{row.email}</td>
								<td className="px-4 py-3 text-text-primary">{row.clubName}</td>
								<td className="px-4 py-3 text-text-secondary">{row.city}</td>
								<td className="px-4 py-3 text-text-secondary">
									{row.submittedAt}
								</td>
								<td className="px-4 py-3">
									<StatusPill status={row.status} />
								</td>
								<td className="px-4 py-3">
									<div className="flex flex-wrap gap-2">
										<Button type="button" variant="default" size="sm">
											Approve
										</Button>
										<Button type="button" variant="outline" size="sm">
											Reject
										</Button>
										<Button type="button" variant="ghost" size="sm">
											Details
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
