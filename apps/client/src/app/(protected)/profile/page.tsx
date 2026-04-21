import type { Metadata } from "next";
import { ProfileLeftColumn } from "@/components/modules/profile/layout/ProfileLeftColumn";
import { ProfileRightColumn } from "@/components/modules/profile/layout/ProfileRightColumn";

export const metadata: Metadata = {
	title: "Player Profile — ROTRA",
	description: "View player profile.",
};

export default async function PlayerProfilePage() {
	return (
		<div className="pb-12 px-4 md:px-8 flex flex-col lg:flex-row gap-8">
			<ProfileLeftColumn />
			<ProfileRightColumn />
		</div>
	);
}
