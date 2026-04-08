import { MoreVertical, Share2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Player Profile — ROTRA",
	description: "View player profile.",
};

const MOCK_PLAYER = {
	id: "u1",
	name: "Alex Santos",
	level: "Intermediate",
	tier: "Warrior 2",
	exp: 620,
	initials: "AS",
	stats: [
		{ label: "Games", value: "42" },
		{ label: "Wins", value: "28" },
		{ label: "Win Rate", value: "67%", accent: true },
		{ label: "Sessions", value: "12" },
		{ label: "Clubs", value: "3" },
		{ label: "Rating", value: "★ 3.8", accent: true },
	],
	playStyle: ["Doubles", "Front Court", "Social"],
	gear: [
		{
			category: "RACKETS",
			items: [
				{
					title: "Main Racket",
					brand: "Yonex",
					model: "Astrox 99",
					specs: ["Head Heavy", "BG80", "26 lbs"],
				},
			],
		},
		{ category: "SHOES", items: [] },
	],
	recentMatches: [
		{
			id: "m1",
			date: "Mar 22",
			club: "Sunrise BC",
			result: "W",
			teams: "Alex+Maria vs Jose+Ana",
			score: "21 – 15",
		},
		{
			id: "m2",
			date: "Mar 15",
			club: "Sunrise BC",
			result: "L",
			teams: "Alex+Jose vs Maria+Ana",
			score: "14 – 21",
		},
	],
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
		<div className="max-w-[1100px] mx-auto p-4 md:p-8">
			{/* Mobile header */}
			<div className="flex items-center justify-between mb-6 lg:hidden">
				<button
					type="button"
					className="text-text-disabled hover:text-text-primary transition-colors"
					aria-label="Share profile"
				>
					<Share2 size={20} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					className="text-text-disabled hover:text-text-primary transition-colors"
					aria-label="More options"
				>
					<MoreVertical size={20} strokeWidth={1.5} />
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
				{/* Left column: identity */}
				<div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
					{/* Avatar + hero */}
					<div className="flex flex-col items-center gap-3 lg:items-start">
						<div className="size-[72px] lg:size-20 rounded-full bg-bg-elevated border-2 border-bg-elevated flex items-center justify-center">
							<span className="text-title font-black text-text-secondary">
								{player.initials}
							</span>
						</div>

						<h1 className="text-display font-bold text-text-primary">
							{player.name}
						</h1>

						<span className="px-3 py-1 bg-bg-elevated text-text-secondary text-micro font-bold uppercase tracking-widest rounded-full">
							{player.level}
						</span>

						{/* Tier + EXP strip */}
						<div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-full">
							<span className="size-2 rounded-full bg-accent" />
							<span className="text-body font-medium text-text-primary">
								{player.tier}
							</span>
							<span className="text-small text-text-secondary">
								· {player.exp} EXP
							</span>
						</div>
					</div>

					{/* Play style */}
					<div className="flex flex-col gap-2">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Play Style
						</p>
						<div className="flex flex-wrap gap-2">
							{player.playStyle.map((tag) => (
								<span
									key={tag}
									className="px-3 py-1 bg-bg-elevated text-text-secondary text-small rounded-full"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					{/* Gear */}
					<div className="flex flex-col gap-4">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Gear
						</p>
						{player.gear.map((category) => (
							<div key={category.category} className="flex flex-col gap-2">
								<p className="text-micro font-bold uppercase tracking-widest text-text-disabled">
									{category.category}
								</p>
								{category.items.length > 0 ? (
									category.items.map((item) => (
										<div
											key={item.title}
											className="bg-bg-surface border border-border rounded-lg p-4 shadow-card"
										>
											<p className="text-body font-bold text-text-primary">
												{item.title}
											</p>
											<p className="text-body text-text-secondary">
												{item.brand} {item.model}
											</p>
											<div className="flex flex-wrap gap-1 mt-2">
												{item.specs.map((spec) => (
													<span
														key={spec}
														className="px-2 py-0.5 bg-bg-elevated text-small text-text-secondary rounded-full"
													>
														{spec}
													</span>
												))}
											</div>
										</div>
									))
								) : (
									<p className="text-body text-text-disabled">
										No gear listed.
									</p>
								)}
							</div>
						))}
					</div>

					{/* Desktop action buttons */}
					<div className="hidden lg:flex gap-3">
						<button
							type="button"
							className="flex-1 h-10 flex items-center justify-center gap-2 text-small font-bold uppercase tracking-widest text-text-secondary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
						>
							<Share2 size={14} strokeWidth={1.5} />
							Share
						</button>
						<button
							type="button"
							className="flex-1 h-10 flex items-center justify-center text-small font-bold uppercase tracking-widest text-text-secondary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
						>
							Compare
						</button>
					</div>
				</div>

				{/* Right column: stats + skills */}
				<div className="flex flex-col gap-6">
					{/* Stats grid */}
					<div className="flex flex-col gap-3">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Stats
						</p>
						<div className="grid grid-cols-3 gap-3">
							{player.stats.map((stat) => (
								<div
									key={stat.label}
									className="bg-bg-surface border border-border rounded-lg p-3 shadow-card flex flex-col gap-1"
								>
									<span
										className={`text-title font-semibold ${
											stat.accent ? "text-accent" : "text-text-primary"
										}`}
									>
										{stat.value}
									</span>
									<span className="text-micro text-text-secondary uppercase tracking-widest">
										{stat.label}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Skill rating */}
					<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
								Skill Rating
							</p>
							<span className="text-body font-semibold text-accent">★ 3.8</span>
						</div>

						{[
							"Attack",
							"Defense",
							"Net & Touch",
							"Precision & Control",
							"Athleticism",
							"Game Intelligence",
						].map((dimension, i) => {
							const value = [4.1, 3.5, 3.2, 3.8, 4.0, 3.6][i] ?? 0;
							return (
								<div key={dimension} className="flex items-center gap-3">
									<span className="text-body text-text-primary w-40 shrink-0">
										{dimension}
									</span>
									<div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
										<div
											className="h-full bg-accent rounded-full"
											style={{ width: `${(value / 5) * 100}%` }}
										/>
									</div>
									<span className="text-small text-accent font-medium w-8 text-right">
										{value}
									</span>
								</div>
							);
						})}
					</div>

					{/* Match history */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
								Match History
							</p>
							<button
								type="button"
								className="text-small text-accent font-medium"
							>
								View All →
							</button>
						</div>
						<div className="bg-bg-surface border border-border rounded-lg shadow-card overflow-hidden">
							{player.recentMatches.map((match, idx) => (
								<div
									key={match.id}
									className={`flex items-center gap-4 px-4 py-3 ${
										idx < player.recentMatches.length - 1
											? "border-b border-border"
											: ""
									}`}
								>
									<span
										className={`text-small font-black w-6 text-center px-1.5 py-0.5 rounded ${
											match.result === "W"
												? "bg-accent/10 text-accent"
												: "bg-error/10 text-error"
										}`}
									>
										{match.result}
									</span>
									<div className="flex-1 min-w-0">
										<p className="text-small text-text-primary truncate">
											{match.teams}
										</p>
										<p className="text-small text-text-secondary">
											{match.date} · {match.club}
										</p>
									</div>
									<span className="text-small text-text-secondary shrink-0">
										{match.score}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Advanced stats */}
					<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex flex-col gap-2">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Advanced Stats
						</p>
						<p className="text-small text-text-disabled">
							Unlocks at 20 matches · {42} played
						</p>
						{[
							{ label: "Most frequent partner", value: "Maria Cruz" },
							{ label: "Best partner win rate", value: "80%" },
							{ label: "Toughest opponent", value: "Jose B." },
							{ label: "Peak skill rating", value: "★ 4.1" },
						].map((row) => (
							<div
								key={row.label}
								className="flex items-center justify-between py-1"
							>
								<span className="text-small text-text-secondary">
									{row.label}
								</span>
								<span className="text-body font-medium text-text-primary">
									{row.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
