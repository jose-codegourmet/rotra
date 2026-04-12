import type { Metadata } from "next";

import { ProvisionBox } from "@/components/modules/club-profile/ProvisionBox";

export const metadata: Metadata = {
	title: "Club settings — ROTRA",
	description: "Club configuration.",
};

export default async function ManageSettingsPage({
	params,
}: {
	params: Promise<{ clubId: string }>;
}) {
	await params;

	return (
		<div className="flex flex-col gap-6">
			<h2 className="text-title font-bold text-text-primary">Settings</h2>
			<div className="grid gap-4 md:grid-cols-2">
				<ProvisionBox title="Public invite link & QR">
					Toggle whether members can share invite links (see overview sidebar).
				</ProvisionBox>
				<ProvisionBox title="Auto-approve & visibility">
					Club discovery and join automation (UI placeholders).
				</ProvisionBox>
				<ProvisionBox title="Delete club (owner only)">
					Interim: requests go to jose@codegourmet.io until admin portal exists.
					QM cannot delete the club.
				</ProvisionBox>
				<ProvisionBox title="Hero image & description">
					Public profile content management.
				</ProvisionBox>
			</div>
		</div>
	);
}
