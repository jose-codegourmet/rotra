"use client";

import Link from "next/link";
import { useState } from "react";
import {
	PlayerRow,
	StatusPill,
	UmpireShell,
} from "@/components/modules/umpire-shell/UmpireShell";
import {
	formatVenueLine,
	MOCK_SUBMIT_CONFIRM,
	MOCK_UMPIRE_MATCH,
	MOCK_UMPIRE_TEAMS,
} from "@/constants/mock-umpire-match";

export type SubmitConfirmViewProps = {
	initiallyLocked?: boolean;
};

export function SubmitConfirmView({
	initiallyLocked = false,
}: SubmitConfirmViewProps) {
	const [locked, setLocked] = useState(initiallyLocked);
	const copy = MOCK_SUBMIT_CONFIRM;
	const match = MOCK_UMPIRE_MATCH;

	return (
		<UmpireShell youStatus={copy.youStatus}>
			<div className="flex min-h-0 flex-1 flex-col pt-4 md:grid md:grid-cols-2 md:gap-4 md:pt-6 lg:gap-5">
				<section className="flex min-h-0 flex-1 flex-col">
					<StatusPill className="text-accent">{copy.eyebrow}</StatusPill>
					<h1 className="mt-2 text-display font-bold tracking-tight text-text-primary">
						{copy.headline}
					</h1>
					<p className="mt-2 text-heading font-bold tracking-tight text-text-primary">
						{copy.resultTeam}{" "}
						<em className="not-italic text-accent">{copy.resultScore}</em>{" "}
						{copy.resultSets}
					</p>
					<p className="mt-2 flex items-start gap-2 text-small text-text-secondary">
						<LockIcon />
						{copy.lockNote}
					</p>

					<div className="mt-3 grid grid-cols-3 gap-1.5 md:hidden">
						{copy.sets.map((set) => (
							<div
								key={set.label}
								className={`rounded-md border px-1.5 py-2.5 text-center shadow-card ${
									set.done
										? "border-accent/20 bg-bg-surface"
										: "border-border bg-bg-surface"
								}`}
							>
								<p className="text-micro font-medium uppercase tracking-widest text-text-secondary">
									{set.label}
								</p>
								<p
									className={`mt-1 text-heading font-bold tracking-tight ${
										set.done ? "text-accent" : "font-medium text-text-disabled"
									}`}
								>
									{set.score}
								</p>
								<p className="mt-1 text-micro font-semibold uppercase tracking-widest text-text-secondary">
									{set.note}
								</p>
							</div>
						))}
					</div>

					<div className="mt-5 hidden flex-col gap-2 md:flex">
						{copy.sets.map((set) => (
							<div
								key={set.label}
								className={`flex h-14 items-center justify-between rounded-md border px-4 shadow-card ${
									set.done
										? "border-accent/20 bg-accent-subtle"
										: "border-border bg-bg-elevated"
								}`}
							>
								<span className="text-label font-medium uppercase tracking-widest text-text-secondary">
									{set.label}
								</span>
								<span
									className={`text-title font-bold tracking-tight ${
										set.done ? "text-accent" : "font-medium text-text-disabled"
									}`}
								>
									{set.score}
								</span>
							</div>
						))}
					</div>

					<div className="mt-auto hidden pt-6 md:block lg:max-w-[360px]">
						<SubmitActions locked={locked} onSubmit={() => setLocked(true)} />
					</div>
				</section>

				<aside className="mt-3 flex flex-col md:mt-0">
					<p className="mb-4 hidden text-small text-text-secondary md:block lg:hidden">
						{formatVenueLine([
							match.venue,
							match.court,
							match.format,
							match.window,
						])}
					</p>

					<div className="overflow-hidden rounded-lg border border-border bg-bg-surface shadow-card">
						<div className="flex h-9 items-center justify-between border-b border-border px-4">
							<span className="text-label font-medium uppercase tracking-widest text-text-secondary">
								{MOCK_UMPIRE_TEAMS.A.label}
							</span>
							<span className="inline-flex h-[22px] items-center rounded-full border border-accent/20 bg-accent-subtle px-2 text-micro font-semibold uppercase tracking-widest text-accent">
								{copy.winsBadge}
							</span>
						</div>
						{MOCK_UMPIRE_TEAMS.A.players.map((player) => (
							<div
								key={player.initials}
								className="border-b border-border last:border-b-0"
							>
								<PlayerRow
									name={player.name}
									initials={player.initials}
									teamLabel={MOCK_UMPIRE_TEAMS.A.label}
									winning
								/>
							</div>
						))}
					</div>

					<div className="mt-2 overflow-hidden rounded-lg border border-border bg-bg-surface shadow-card md:mt-3">
						<div className="flex h-9 items-center border-b border-border px-4">
							<span className="text-label font-medium uppercase tracking-widest text-text-secondary">
								{MOCK_UMPIRE_TEAMS.B.label}
							</span>
						</div>
						{MOCK_UMPIRE_TEAMS.B.players.map((player) => (
							<div
								key={player.initials}
								className="border-b border-border last:border-b-0"
							>
								<PlayerRow
									name={player.name}
									initials={player.initials}
									teamLabel={MOCK_UMPIRE_TEAMS.B.label}
								/>
							</div>
						))}
					</div>

					<div className="mt-auto pt-4 md:hidden">
						<SubmitActions locked={locked} onSubmit={() => setLocked(true)} />
					</div>
				</aside>
			</div>
		</UmpireShell>
	);
}

SubmitConfirmView.displayName = "SubmitConfirmView";

function SubmitActions({
	locked,
	onSubmit,
}: {
	locked: boolean;
	onSubmit: () => void;
}) {
	const copy = MOCK_SUBMIT_CONFIRM;

	return (
		<div>
			<button
				type="button"
				onClick={onSubmit}
				disabled={locked}
				className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent text-small font-medium uppercase tracking-widest text-bg-base shadow-accent transition-opacity duration-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
			>
				{locked ? <LockIcon className="stroke-bg-base" /> : <CheckIcon />}
				{locked ? copy.lockedCta : copy.submitCta}
			</button>
			{locked ? (
				<p className="mt-3 text-center text-small text-text-secondary">
					{copy.lockedNote}
				</p>
			) : null}
			<Link
				href="/scoreboard"
				className="mt-1 inline-flex min-h-11 w-full items-center justify-center text-body font-medium text-text-secondary transition-colors duration-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
			>
				{copy.cancelCta}
			</Link>
		</div>
	);
}

function LockIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`size-4 shrink-0 ${className ?? "stroke-text-secondary"}`}
			aria-hidden="true"
		>
			<rect x="6" y="11" width="12" height="9" rx="1.8" />
			<path d="M8.4 11V8.4a3.6 3.6 0 0 1 7.2 0V11" />
		</svg>
	);
}

function CheckIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="size-[18px] stroke-bg-base"
			aria-hidden="true"
		>
			<path d="M5 12.5l4.2 4.2L19 7.5" />
		</svg>
	);
}
