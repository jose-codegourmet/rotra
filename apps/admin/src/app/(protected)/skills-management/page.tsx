import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { MatchExpAwardsTable } from "@/components/modules/skills-management/MatchExpAwardsTable";

export default function SkillsManagementPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-10">
			<PageSection
				title="Match EXP Awards"
				description="Manage match-related EXP awards that feed player progression."
			>
				<MatchExpAwardsTable />
			</PageSection>

			<PageSection
				title="Guardrails"
				description="Rules enforced by the gamification model and ledgers."
			>
				<ul className="list-disc space-y-2 pl-5 text-small text-text-secondary">
					<li>EXP rows are append-only and stored in `exp_transactions`.</li>
					<li>
						MMR and match EXP awards apply only to `club_queue` sessions with
						`schedule_type = &quot;mmr&quot;`.
					</li>
					<li>
						Void operations insert compensating `match_voided_reversal` entries;
						no deletion of original rows.
					</li>
					<li>
						Changes apply to future transactions and do not recompute historical
						EXP.
					</li>
					<li>
						Reason keys are restricted to existing `exp_reason_enum` values.
					</li>
				</ul>
			</PageSection>
		</div>
	);
}
