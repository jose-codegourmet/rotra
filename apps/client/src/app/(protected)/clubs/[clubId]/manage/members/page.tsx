import type { Metadata } from "next";

import { ClubManageMembersTable } from "@/components/modules/club-profile/ClubManageMembersTable";
import { ProvisionBox } from "@/components/modules/club-profile/ProvisionBox";
import { MOCK_MANAGE_MEMBER_ROWS } from "@/constants/mock-club";

export const metadata: Metadata = {
	title: "Manage members — ROTRA",
	description: "Club member administration.",
};

export default async function ManageMembersPage({
	params,
}: {
	params: Promise<{ clubId: string }>;
}) {
	await params;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h2 className="text-title font-bold text-text-primary">Members</h2>
					<p className="text-small text-text-secondary mt-1">
						Operator-oriented grid — different from the public profile roster.
					</p>
				</div>
				<button
					type="button"
					className="h-11 px-5 text-small font-black uppercase tracking-widest text-bg-base bg-accent rounded-md shadow-accent shrink-0"
				>
					Add Que Master
				</button>
			</div>

			<ClubManageMembersTable data={MOCK_MANAGE_MEMBER_ROWS} />

			<div className="grid gap-4 md:grid-cols-2">
				<ProvisionBox title="Bulk assign QM">
					Multi-select and role changes will be built in a later phase.
				</ProvisionBox>
				<ProvisionBox title="Member import / export">
					CSV or roster sync placeholders.
				</ProvisionBox>
			</div>
		</div>
	);
}
