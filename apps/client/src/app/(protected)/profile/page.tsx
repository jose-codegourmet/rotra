import type { Metadata } from "next";
import { CurrentGearCard } from "@/app/components/module/profile/CurrentGearCard/CurrentGearCard";
import { MatchHistory } from "@/app/components/module/profile/MatchHistory/MatchHistory";
import { MetricsCard } from "@/app/components/module/profile/MetricsCard/MetricsCard";
import { PlayerHeaderCard } from "@/app/components/module/profile/PlayerHeaderCard/PlayerHeaderCard";
import { PlayStyleCard } from "@/app/components/module/profile/PlayStyleCard/PlayStyleCard";
import { SkillCalibrationCard } from "@/app/components/module/profile/SkillCalibrationCard/SkillCalibrationCard";
import { StatsCards } from "@/app/components/module/profile/StatsCards/StatsCards";
import { MOCK_PLAYER } from "@/constants/mock-player";

export const metadata: Metadata = {
	title: "Player Profile — ROTRA",
	description: "View player profile.",
};

export default async function PlayerProfilePage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;
	const player = MOCK_PLAYER;

	console.log("[+] userId = ", userId);

	return (
		<div className="pb-12 px-4 md:px-8 flex flex-col lg:flex-row gap-8">
			{/* ── Left Column (≈35%) ── */}
			<div className="lg:w-[35%] shrink-0">
				<div className="lg:sticky lg:top-24 space-y-6">
					<PlayerHeaderCard player={player} />
					<PlayStyleCard player={player} />
					<CurrentGearCard player={player} />
				</div>
			</div>

			{/* ── Right Column (flex-1) ── */}
			<div className="flex-1 space-y-8">
				<StatsCards player={player} />
				<SkillCalibrationCard player={player} />
				<MatchHistory matches={player.recentMatches} maxMatchPerView={3} />
				<MetricsCard />
			</div>
		</div>
	);
}
