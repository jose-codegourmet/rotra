import { MapPin, Search, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Explore Clubs — ROTRA",
	description: "Discover and join badminton clubs near you.",
};

const MOCK_CLUBS = [
	{
		id: "1",
		name: "Sunrise Badminton Club",
		location: "Quezon City",
		members: 24,
		description:
			"Competitive-social club focused on doubles rotational play. Open to all levels.",
		founded: "Jan 2024",
		status: "member",
	},
	{
		id: "2",
		name: "Metro Badminton",
		location: "Makati",
		members: 12,
		description:
			"Casual social play for working professionals. Friendly atmosphere.",
		founded: "Mar 2024",
		status: "not-member",
	},
	{
		id: "3",
		name: "Shuttle Kings PH",
		location: "Pasig City",
		members: 38,
		description:
			"Competitive club with weekly ranked sessions and monthly tournaments.",
		founded: "Jun 2023",
		status: "pending",
	},
	{
		id: "4",
		name: "Birdie Club Manila",
		location: "Manila",
		members: 19,
		description:
			"Mixed-level club with structured coaching and skill development sessions.",
		founded: "Nov 2023",
		status: "not-member",
	},
];

export default function ExplorePage() {
	return (
		<div className="max-w-[1400px] mx-auto p-4 md:p-8">
			<div className="flex flex-col gap-6">
				{/* Page header */}
				<div>
					<p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
						Explore
					</p>
					<h1 className="text-display font-bold text-text-primary tracking-tight">
						Discover Clubs
					</h1>
					<p className="text-body text-text-secondary mt-2">
						Find public clubs and request to join.
					</p>
				</div>

				{/* Search bar */}
				<div className="relative">
					<Search
						size={18}
						strokeWidth={1.5}
						className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
					/>
					<input
						type="text"
						placeholder="Search clubs..."
						className="w-full h-12 pl-11 pr-4 bg-bg-elevated border border-border rounded-md text-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
					/>
				</div>

				{/* Results count */}
				<p className="text-small text-text-secondary">
					Showing {MOCK_CLUBS.length} results
				</p>

				{/* Club cards grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{MOCK_CLUBS.map((club) => (
						<div
							key={club.id}
							className="bg-bg-surface border border-border rounded-lg p-4 shadow-card flex flex-col gap-2 cursor-pointer hover:bg-bg-elevated transition-colors duration-default"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex flex-col gap-1 flex-1 min-w-0">
									<h2 className="text-heading font-semibold text-text-primary truncate">
										{club.name}
									</h2>
									<div className="flex items-center gap-1 text-small text-text-secondary">
										<MapPin size={14} strokeWidth={1.5} className="shrink-0" />
										<span>
											{club.location} · {club.members} members
										</span>
									</div>
									<p className="text-body text-text-secondary line-clamp-2 mt-1">
										{club.description}
									</p>
									<p className="text-small text-text-disabled">
										Est. {club.founded}
									</p>
								</div>

								{/* CTA */}
								<div className="shrink-0 mt-1">
									{club.status === "member" && (
										<button
											type="button"
											className="h-9 px-4 text-small font-bold uppercase tracking-widest text-text-secondary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
										>
											View
										</button>
									)}
									{club.status === "not-member" && (
										<button
											type="button"
											className="h-9 px-4 text-small font-bold uppercase tracking-widest text-bg-base bg-accent rounded-md hover:opacity-90 transition-opacity duration-default"
										>
											Join
										</button>
									)}
									{club.status === "pending" && (
										<button
											type="button"
											disabled
											className="h-9 px-4 text-small font-bold uppercase tracking-widest text-text-disabled border border-border rounded-md opacity-60 cursor-not-allowed"
										>
											Pending
										</button>
									)}
								</div>
							</div>

							<div className="flex items-center gap-1 text-small text-text-disabled mt-1">
								<Users size={13} strokeWidth={1.5} />
								<span>{club.members} members</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
