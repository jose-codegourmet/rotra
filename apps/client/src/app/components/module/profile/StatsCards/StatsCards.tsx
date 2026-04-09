import type { TPlayerModel } from "@/types/player";

interface StatsCardsProps {
	player: TPlayerModel;
}
export function StatsCards({ player }: StatsCardsProps) {
	return (
		<section className="grid grid-cols-3 gap-4">
			{player.stats.map((stat) => (
				<div
					key={stat.label}
					className={`bg-bg-surface p-6 rounded-xl hover:bg-bg-elevated transition-all ${
						stat.accent
							? "border border-accent/20 shadow-[0_0_20px_rgba(0,255,136,0.05)]"
							: ""
					}`}
				>
					<span
						className={`text-[10px] uppercase tracking-[0.2em] font-black block mb-2 ${
							stat.accent ? "text-accent" : "text-text-secondary"
						}`}
					>
						{stat.label}
					</span>
					<div className="flex items-baseline gap-2">
						<span
							className={`text-4xl font-black tracking-tighter ${
								stat.accent ? "text-accent" : "text-text-primary"
							}`}
						>
							{stat.value}
						</span>
						{stat.sub && (
							<span
								className={`text-[10px] font-bold ${
									stat.accent ? "text-accent" : "text-text-secondary"
								}`}
							>
								{stat.sub}
							</span>
						)}
					</div>
				</div>
			))}
		</section>
	);
}
