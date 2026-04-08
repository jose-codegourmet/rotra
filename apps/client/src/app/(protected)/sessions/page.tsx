import { CalendarClock, Plus } from "lucide-react";
import type { Metadata } from "next";

import {
	SESSION_FILTER_TABS,
	SESSIONS,
	STATUS_CONFIG,
} from "@/constants/mock-sessions";

export const metadata: Metadata = {
	title: "Sessions — ROTRA",
	description: "Browse and manage your badminton sessions.",
};

export default function SessionsPage() {
	return (
		<div className="max-w-[1000px] mx-auto p-4 md:p-8">
			<div className="flex flex-col gap-6">
				{/* Page header */}
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
							Sessions
						</p>
						<h1 className="text-display font-bold text-text-primary tracking-tight">
							Your Sessions
						</h1>
						<p className="text-body text-text-secondary mt-2">
							Track your registered and upcoming sessions.
						</p>
					</div>
					<button
						type="button"
						className="shrink-0 hidden md:flex items-center gap-2 h-10 px-4 text-small font-black uppercase tracking-widest text-bg-base bg-gradient-to-br from-[#f1ffef] to-accent rounded-md shadow-accent transition-transform active:scale-95"
					>
						<Plus size={16} strokeWidth={2} />
						Create Session
					</button>
				</div>

				{/* Filter tabs */}
				<div className="flex items-center border-b border-border gap-0">
					{SESSION_FILTER_TABS.map((tab, idx) => (
						<button
							key={tab}
							type="button"
							className={`h-10 px-4 text-label font-bold uppercase tracking-widest transition-colors duration-default border-b-2 ${
								idx === 0
									? "text-accent border-accent"
									: "text-text-disabled border-transparent hover:text-text-primary"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Session cards */}
				{SESSIONS.length > 0 ? (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{SESSIONS.map((session) => {
							const config = STATUS_CONFIG[session.status];
							const isLive = session.status === "live";
							const isCompleted = session.status === "completed";

							return (
								<div
									key={session.id}
									className={`bg-bg-surface border border-border rounded-lg p-4 shadow-card flex flex-col gap-3 cursor-pointer hover:bg-bg-elevated transition-colors duration-default ${
										isLive ? "lg:col-span-2" : ""
									}`}
								>
									{/* Status badge */}
									<div className="flex items-center gap-2">
										{config.dotColor && (
											<span
												className={`size-2 rounded-full ${config.dotColor} animate-pulse`}
											/>
										)}
										<span
											className={`text-micro font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${config.className}`}
										>
											{config.label}
										</span>
										<span className="text-small text-text-disabled ml-auto">
											{session.club}
										</span>
									</div>

									{/* Date + venue */}
									<div>
										<p className="text-heading font-semibold text-text-primary">
											{session.date}
										</p>
										<div className="flex items-center gap-1 text-small text-text-secondary mt-0.5">
											<CalendarClock size={13} strokeWidth={1.5} />
											<span>
												{session.venue} · {session.time}
											</span>
										</div>
									</div>

									{/* Slots + cost */}
									{!isCompleted ? (
										<div className="flex items-center justify-between">
											<div className="flex flex-col gap-0.5">
												<span className="text-small text-text-secondary">
													{session.slots}/{session.total} slots ·{" "}
													{session.registrationStatus === "accepted" && (
														<span className="text-accent font-bold">
															Accepted
														</span>
													)}
													{!session.registrationStatus && "Not Registered"}
												</span>
												<span className="text-small text-text-secondary">
													₱{session.cost}/player · {session.format}
												</span>
											</div>

											{!session.registrationStatus && (
												<button
													type="button"
													className="h-9 px-4 text-small font-bold uppercase tracking-widest text-bg-base bg-accent rounded-md hover:opacity-90 transition-opacity duration-default"
												>
													Register
												</button>
											)}
										</div>
									) : (
										<div className="flex items-center justify-between">
											<span className="text-small text-text-secondary">
												{session.total} players ·{" "}
												{
													(
														session as typeof session & {
															matchesPlayed?: number;
														}
													).matchesPlayed
												}{" "}
												matches played
											</span>
											<button
												type="button"
												className="h-9 px-4 text-small font-bold uppercase tracking-widest text-text-secondary border border-border rounded-md hover:bg-bg-elevated transition-colors duration-default"
											>
												View Results
											</button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-20 gap-4">
						<CalendarClock
							size={40}
							strokeWidth={1}
							className="text-text-disabled"
						/>
						<div className="text-center">
							<p className="text-heading font-semibold text-text-primary">
								No sessions yet
							</p>
							<p className="text-body text-text-secondary mt-1">
								Register for a session or create one from your club.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Mobile FAB */}
			<button
				type="button"
				className="fixed bottom-24 right-5 md:hidden size-14 flex items-center justify-center rounded-full bg-accent shadow-accent text-bg-base z-40"
				aria-label="Create session"
			>
				<Plus size={24} strokeWidth={2} />
			</button>
		</div>
	);
}
