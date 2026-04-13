import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { KillSwitchesPanel } from "@/components/modules/kill-switches/KillSwitchesPanel/KillSwitchesPanel";
import { MOCK_KILL_SWITCHES } from "@/constants/mock-admin-pages";

export default function KillSwitchesPage() {
	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<PageSection
				title="Kill switches"
				description="Turn entire features off without a deploy. Toggles below only change local UI state — they are not persisted."
			>
				<KillSwitchesPanel rows={MOCK_KILL_SWITCHES} />
			</PageSection>

			<PageSection
				title="Rollout notes"
				description="When wiring the backend, log every toggle with admin id, timestamp, and previous value."
			>
				<div className="rounded-lg border border-border bg-bg-surface p-4 text-body text-text-secondary">
					<p>
						Recommended: require a confirmation modal for switches that affect
						payments or auth. Use read-only mode for non–super-admins if needed.
					</p>
				</div>
			</PageSection>
		</div>
	);
}
