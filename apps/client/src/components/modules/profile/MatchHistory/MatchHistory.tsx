import Link from "next/link";

import { type Match, MatchCard } from "../MatchCard/MatchCard";

interface MatchHistoryProps {
	matches: Match[];
	maxMatchPerView: number;
	viewAllHref?: string;
}

export function MatchHistory({
	matches,
	maxMatchPerView,
	viewAllHref,
}: MatchHistoryProps) {
	const visibleMatches = matches.slice(0, maxMatchPerView);

	return (
		<section>
			<div className="flex justify-between items-end mb-6">
				<h3 className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
					Recent Match Performance
				</h3>
				{viewAllHref ? (
					<Link
						href={viewAllHref}
						className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
					>
						View All Matches
					</Link>
				) : (
					<button
						type="button"
						className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
					>
						View All Matches
					</button>
				)}
			</div>

			<div className="space-y-2">
				{visibleMatches.map((match) => (
					<MatchCard key={match.id} match={match} />
				))}
			</div>
		</section>
	);
}
