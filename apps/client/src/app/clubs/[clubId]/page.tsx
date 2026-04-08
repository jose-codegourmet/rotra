import { CalendarClock, MapPin, MoreVertical, Users } from "lucide-react";
import type { Metadata } from "next";

import { MOCK_CLUB } from "@/app/constants/mock-club";

export const metadata: Metadata = {
	title: "Club Profile — ROTRA",
	description: "View club details and sessions.",
};

export default async function ClubProfilePage({
	params,
}: {
	params: Promise<{ clubId: string }>;
}) {
	const { clubId } = await params;
	const club = MOCK_CLUB;

	console.log("[+] clubId = ", clubId);

	return (
		<div className="max-w-[1100px] mx-auto p-4 md:p-8">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
				{/* Left column */}
				<div className="flex flex-col gap-6">
					{/* Club hero */}
					<div className="flex flex-col gap-2">
						<div className="flex items-start justify-between gap-4">
							<h1 className="text-display font-bold text-text-primary tracking-tight">
								{club.name}
							</h1>
							<button
								type="button"
								className="text-text-disabled hover:text-text-primary transition-colors duration-default mt-1"
								aria-label="More options"
							>
								<MoreVertical size={20} strokeWidth={1.5} />
							</button>
						</div>

						<div className="flex items-center gap-1 text-body text-text-secondary">
							<MapPin size={15} strokeWidth={1.5} className="shrink-0" />
							<span>{club.location}</span>
						</div>

						<div className="flex items-center gap-2 text-small text-text-secondary">
							<span className="px-2 py-0.5 bg-accent/10 text-accent text-micro font-bold uppercase tracking-widest rounded-full">
								{club.status}
							</span>
							<span>· Est. {club.founded}</span>
						</div>
					</div>

					{/* Divider */}
					<div className="h-px bg-border" />

					{/* Description */}
					<p className="text-body text-text-secondary leading-relaxed">
						{club.description}
					</p>

					{/* Upcoming sessions */}
					<div className="flex flex-col gap-3">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary">
							Upcoming Sessions
						</p>
						{club.upcomingSessions.length > 0 ? (
							club.upcomingSessions.map((session) => (
								<div
									key={session.id}
									className="bg-bg-surface border border-border rounded-lg p-4 shadow-card flex items-center justify-between cursor-pointer hover:bg-bg-elevated transition-colors duration-default"
								>
									<div className="flex flex-col gap-1">
										<p className="text-body font-semibold text-text-primary">
											{session.date}
										</p>
										<div className="flex items-center gap-1 text-small text-text-secondary">
											<CalendarClock size={13} strokeWidth={1.5} />
											<span>
												{session.venue} · {session.time}
											</span>
										</div>
									</div>
									<span
										className={`text-small font-bold ${
											session.slots > 0 ? "text-accent" : "text-text-disabled"
										}`}
									>
										{session.slots}/{session.total} slots
									</span>
								</div>
							))
						) : (
							<p className="text-small text-text-disabled">
								No upcoming sessions.
							</p>
						)}
					</div>

					{/* Owner attribution */}
					<div className="flex items-center gap-2 text-small text-text-secondary pt-2">
						<div className="size-6 rounded-full bg-bg-elevated flex items-center justify-center text-micro font-bold text-text-secondary">
							{club.owner.initials}
						</div>
						<span>
							Owned by{" "}
							<span className="text-text-primary font-medium">
								{club.owner.name}
							</span>
						</span>
					</div>
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-4">
					{/* Stats */}
					<div className="bg-bg-surface border border-border rounded-lg p-4 shadow-card">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary mb-3">
							Club Stats
						</p>
						<div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
							{[
								{ label: "Members", value: club.stats.members },
								{ label: "Que Masters", value: club.stats.queMasters },
								{ label: "Sessions", value: club.stats.sessions },
							].map((stat) => (
								<div
									key={stat.label}
									className="bg-bg-base border border-border rounded-lg p-3 flex lg:flex-row flex-col lg:items-center lg:justify-between gap-1"
								>
									<span className="text-small text-text-secondary uppercase tracking-widest">
										{stat.label}
									</span>
									<span className="text-title font-semibold text-text-primary">
										{stat.value}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Members preview */}
					<div className="bg-bg-surface border border-border rounded-lg p-4 shadow-card">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary mb-3">
							Members
						</p>
						<div className="flex items-center">
							{club.members.map((initial, i) => (
								<div
									key={i}
									className="size-9 rounded-full bg-bg-elevated border-2 border-bg-base flex items-center justify-center text-small font-bold text-text-secondary -ml-2 first:ml-0"
								>
									{initial}
								</div>
							))}
							{club.totalMembers > club.members.length && (
								<div className="size-9 rounded-full bg-bg-elevated border-2 border-bg-base flex items-center justify-center text-small font-bold text-text-secondary -ml-2">
									+{club.totalMembers - club.members.length}
								</div>
							)}
						</div>
					</div>

					{/* CTA card */}
					<div className="bg-bg-surface border border-border rounded-lg p-4 shadow-card">
						{club.membershipStatus === "owner" && (
							<button
								type="button"
								className="w-full h-12 flex items-center justify-center gap-2 text-small font-black uppercase tracking-widest text-text-primary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
							>
								<Users size={16} strokeWidth={1.5} />
								Manage Club
							</button>
						)}
						{club.membershipStatus === "member" && (
							<button
								type="button"
								className="w-full h-12 flex items-center justify-center gap-2 text-small font-black uppercase tracking-widest text-text-primary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
							>
								View Sessions
							</button>
						)}
						{club.membershipStatus === "not-member" && (
							<button
								type="button"
								className="w-full h-12 flex items-center justify-center text-small font-black uppercase tracking-widest text-bg-base bg-accent rounded-md hover:opacity-90 transition-opacity duration-default"
							>
								Request to Join
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Mobile sticky CTA */}
			{club.membershipStatus === "not-member" && (
				<div className="fixed bottom-20 md:bottom-0 left-0 right-0 md:left-20 lg:left-64 bg-bg-surface border-t border-border p-4 lg:hidden">
					<button
						type="button"
						className="w-full h-12 flex items-center justify-center text-small font-black uppercase tracking-widest text-bg-base bg-accent rounded-md"
					>
						Request to Join
					</button>
				</div>
			)}
		</div>
	);
}
