import { Edit2, Settings } from "lucide-react";
import type { Metadata } from "next";

import { PROFILE } from "@/constants/mock-profile";
import { SKILL_DIMENSIONS } from "@/constants/skills";

export const metadata: Metadata = {
	title: "Profile — ROTRA",
	description: "Your ROTRA player profile.",
};

export default function ProfilePage() {
	return (
		<div className="max-w-[1100px] mx-auto p-4 md:p-8">
			<div className="flex items-center justify-between mb-6 lg:hidden">
				<h1 className="text-heading font-bold text-text-primary">Profile</h1>
				<a
					href="/settings"
					className="text-text-disabled hover:text-accent transition-colors duration-default"
					aria-label="Settings"
				>
					<Settings size={20} strokeWidth={1.5} />
				</a>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
				{/* Left column: identity */}
				<div className="flex flex-col gap-6">
					{/* Avatar + name hero */}
					<div className="flex flex-col items-center gap-3 lg:items-start">
						<div className="relative">
							<div className="size-[72px] rounded-full bg-bg-elevated border-2 border-bg-elevated flex items-center justify-center">
								<span className="text-title font-black text-text-secondary">
									AS
								</span>
							</div>
						</div>
						<button
							type="button"
							className="text-small text-accent font-medium"
						>
							Edit Photo
						</button>

						<div className="flex items-center gap-2 mt-1">
							<h2 className="text-display font-bold text-text-primary">
								{PROFILE.name}
							</h2>
							<button
								type="button"
								className="text-text-secondary hover:text-accent transition-colors duration-default"
								aria-label="Edit profile"
							>
								<Edit2 size={18} strokeWidth={1.5} />
							</button>
						</div>

						<span className="px-3 py-1 bg-bg-elevated text-text-secondary text-micro font-bold uppercase tracking-widest rounded-full">
							{PROFILE.level}
						</span>

						{/* Tier + EXP strip */}
						<div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-full">
							<span className="size-2 rounded-full bg-accent" />
							<span className="text-body font-medium text-text-primary">
								{PROFILE.tier}
							</span>
							<span className="text-small text-text-secondary">
								· {PROFILE.exp} EXP
							</span>
							<a
								href="/profile/exp-ledger"
								className="text-small text-accent font-bold ml-2"
							>
								EXP LOG →
							</a>
						</div>
					</div>

					{/* Play style */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
								Play Style
							</p>
							<button
								type="button"
								className="text-small text-accent font-medium"
							>
								Edit
							</button>
						</div>
						<div className="flex flex-wrap gap-2">
							{PROFILE.playStyle.map((tag) => (
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

						{/* Rackets */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<p className="text-micro font-bold uppercase tracking-widest text-text-disabled">
									Rackets
								</p>
								<button
									type="button"
									className="text-small text-accent font-medium"
								>
									+ Add
								</button>
							</div>
							{PROFILE.gear.rackets.map((racket) => (
								<div
									key={racket.title}
									className="bg-bg-surface border border-border rounded-lg p-4 shadow-card"
								>
									<p className="text-body font-bold text-text-primary">
										{racket.title}
									</p>
									<p className="text-body text-text-secondary">
										{racket.brand} {racket.model}
									</p>
									<div className="flex flex-wrap gap-1 mt-2">
										{racket.specs.map((spec) => (
											<span
												key={spec}
												className="px-2 py-0.5 bg-bg-elevated text-small text-text-secondary rounded-full"
											>
												{spec}
											</span>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Shoes */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<p className="text-micro font-bold uppercase tracking-widest text-text-disabled">
									Shoes
								</p>
								<button
									type="button"
									className="text-small text-accent font-medium"
								>
									+ Add
								</button>
							</div>
							<div className="border border-dashed border-border rounded-lg p-4 flex items-center justify-center">
								<p className="text-body text-text-disabled">
									+ Add your first shoes
								</p>
							</div>
						</div>
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
							{PROFILE.stats.map((stat) => (
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

					{/* Skill self-assessment */}
					<div className="flex flex-col gap-3">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Skill Baseline
						</p>
						<p className="text-small text-text-secondary">
							Set your baseline until enough match data is available. This
							phases out as ratings come in.
						</p>
						{SKILL_DIMENSIONS.map((dimension) => (
							<div
								key={dimension}
								className="flex items-center justify-between gap-4"
							>
								<span className="text-body text-text-primary w-40 shrink-0">
									{dimension}
								</span>
								<div className="flex items-center gap-1.5">
									{[1, 2, 3, 4, 5].map((dot) => (
										<button
											key={dot}
											type="button"
											className={`size-4 rounded-full transition-colors duration-default ${
												dot <= 3
													? "bg-accent"
													: "bg-bg-elevated border border-border"
											}`}
											aria-label={`Set ${dimension} to ${dot}`}
										/>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Skill rating */}
					<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
								Skill Rating
							</p>
							<span className="text-body font-semibold text-accent">★ 3.8</span>
						</div>
						<p className="text-small text-text-disabled">
							Ratings are calculated from match results. You need at least 5
							matches per dimension for a full breakdown.
						</p>
					</div>

					{/* Reviews received */}
					<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex flex-col gap-3">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Reviews I&apos;ve Received
						</p>
						<p className="text-body text-text-secondary">
							Reviews from opponents are aggregated here. Individual reviewers
							remain anonymous.
						</p>
						<button
							type="button"
							className="w-full h-10 text-small font-bold uppercase tracking-widest text-text-primary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
						>
							View My Reviews
						</button>
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
							<div className="flex items-center justify-center py-10">
								<p className="text-small text-text-disabled">
									No matches recorded yet.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
