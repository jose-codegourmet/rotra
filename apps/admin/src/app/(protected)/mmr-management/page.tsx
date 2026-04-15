import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { MmrAsymmetryConfigTable } from "@/components/modules/mmr-management/MmrAsymmetryConfigTable";

export default function MmrManagementPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-10">
			<PageSection
				title="MMR Asymmetry Config"
				description="Adjust mixed-rank MMR multipliers for future qualifying matches."
			>
				<MmrAsymmetryConfigTable />
			</PageSection>

			<PageSection
				title="Guardrails"
				description="Canonical constraints from gamification data model."
			>
				<ul className="list-disc space-y-2 pl-5 text-small text-text-secondary">
					<li>
						Applies only to `club_queue` sessions with `schedule_type =
						&quot;mmr&quot;`.
					</li>
					<li>
						MMR changes are append-only ledger entries; historical rows are
						never edited.
					</li>
					<li>
						Voided matches must insert compensating reversal transactions.
					</li>
					<li>
						MMR floor is `0`; deltas are capped before dropping below zero.
					</li>
					<li>
						Config edits apply to future matches only and do not backfill
						history.
					</li>
				</ul>
			</PageSection>
		</div>
	);
}
