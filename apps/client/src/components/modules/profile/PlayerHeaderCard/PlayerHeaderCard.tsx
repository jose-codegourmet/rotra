import { PlayerIdentity } from "@/components/modules/profile/PlayerIdentity/PlayerIdentity";
import { TierStrip } from "@/components/modules/profile/TierStrip/TierStrip";
import type { TPlayerModel } from "@/types/player";

interface PlayerHeaderCardProps {
	player: TPlayerModel;
}
export function PlayerHeaderCard({ player }: PlayerHeaderCardProps) {
	return (
		<div className="bg-bg-surface rounded-xl p-8 relative overflow-hidden">
			<div
				className="absolute top-0 right-0 p-4 text-accent/20 text-[60px] rotate-12 select-none pointer-events-none leading-none"
				aria-hidden="true"
			>
				✦
			</div>

			<PlayerIdentity
				name={player.name}
				initials={player.initials}
				level={player.level}
				badge="PRO"
			/>

			<TierStrip tier={player.tier} tierPips={player.tierPips} />
		</div>
	);
}
