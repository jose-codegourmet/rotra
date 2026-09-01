"use client";

import Link from "next/link";
import { useState } from "react";
import {
	PlayerRow,
	StatusPill,
	UmpireShell,
} from "@/components/modules/umpire-shell/UmpireShell";
import {
	formatSetScore,
	formatVenueLine,
	MOCK_LIVE_SCORE,
	MOCK_UMPIRE_MATCH,
	MOCK_UMPIRE_PLAYERS,
	MOCK_UMPIRE_TEAMS,
	type UmpireTeamId,
} from "@/constants/mock-umpire-match";
import { cn } from "@/lib/utils";

export type LiveScoreViewProps = {
	initialTeamA?: number;
	initialTeamB?: number;
	initialLastPoint?: UmpireTeamId | null;
};

export function LiveScoreView({
	initialTeamA = MOCK_LIVE_SCORE.teamAPoints,
	initialTeamB = MOCK_LIVE_SCORE.teamBPoints,
	initialLastPoint = MOCK_LIVE_SCORE.lastPoint,
}: LiveScoreViewProps) {
	const [teamA, setTeamA] = useState(initialTeamA);
	const [teamB, setTeamB] = useState(initialTeamB);
	const [lastPoint, setLastPoint] = useState<UmpireTeamId | null>(
		initialLastPoint,
	);
	const [history, setHistory] = useState<UmpireTeamId[]>(
		initialLastPoint ? [initialLastPoint] : [],
	);

	const addPoint = (team: UmpireTeamId) => {
		if (team === "A") {
			setTeamA((score) => score + 1);
		} else {
			setTeamB((score) => score + 1);
		}
		setLastPoint(team);
		setHistory((prev) => [...prev, team]);
	};

	const undoLastPoint = () => {
		const undone = history.at(-1);
		if (!undone) {
			return;
		}
		if (undone === "A") {
			setTeamA((score) => Math.max(0, score - 1));
		} else {
			setTeamB((score) => Math.max(0, score - 1));
		}
		const next = history.slice(0, -1);
		setHistory(next);
		setLastPoint(next.at(-1) ?? null);
	};

	const setScore = formatSetScore(teamA, teamB);
	const canUndo = history.length > 0;
	const match = MOCK_UMPIRE_MATCH;

	return (
		<UmpireShell youStatus={MOCK_LIVE_SCORE.youStatus}>
			<div className="flex min-h-0 flex-1 flex-col pt-4 md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-4 md:pt-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-4">
				<section className="flex min-h-0 flex-1 flex-col">
					<StatusPill>{MOCK_LIVE_SCORE.eyebrow}</StatusPill>
					<h1 className="mt-2 text-display font-bold tracking-tight text-text-primary">
						{MOCK_LIVE_SCORE.headline}
					</h1>
					<p className="mt-2 text-small text-text-secondary md:hidden">
						{formatVenueLine([match.venue, match.court, match.format])}
					</p>
					<p className="mt-2 hidden text-small text-text-secondary md:block lg:hidden">
						{formatVenueLine([
							match.venue,
							match.court,
							match.format,
							match.window,
						])}
					</p>
					<p className="mt-2 hidden text-body text-text-secondary lg:block">
						{match.rules}
					</p>
					<p className="mt-2 flex items-center gap-1.5 text-label text-text-secondary md:hidden">
						<CourtIcon />
						{match.window} · {match.rulesShort}
					</p>

					<div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-2 md:mt-4 md:gap-3 lg:mt-6 lg:gap-3.5">
						<TeamPad
							label={MOCK_UMPIRE_TEAMS.A.label}
							score={teamA}
							names={MOCK_UMPIRE_TEAMS.A.players.map((player) => player.name)}
							isLast={lastPoint === "A"}
							onPoint={() => addPoint("A")}
						/>
						<TeamPad
							label={MOCK_UMPIRE_TEAMS.B.label}
							score={teamB}
							names={MOCK_UMPIRE_TEAMS.B.players.map((player) => player.name)}
							isLast={lastPoint === "B"}
							onPoint={() => addPoint("B")}
						/>
					</div>

					<div className="mt-3 grid grid-cols-3 gap-1.5 md:hidden">
						<MobileSetCard
							label="Set 1"
							value={setScore}
							status={MOCK_LIVE_SCORE.setStatuses[0]}
							live
						/>
						<MobileSetCard
							label="Set 2"
							value="—"
							status={MOCK_LIVE_SCORE.setStatuses[1]}
						/>
						<MobileSetCard
							label="Set 3"
							value="—"
							status={MOCK_LIVE_SCORE.setStatuses[2]}
						/>
					</div>
				</section>

				<aside className="mt-4 flex flex-col gap-3 md:mt-0">
					<div className="hidden rounded-lg border border-border bg-bg-surface px-4 py-4 shadow-card md:block lg:hidden">
						<p className="text-micro font-medium uppercase tracking-widest text-text-secondary">
							{match.matchLabel}
						</p>
						<p className="mt-1 text-body font-semibold tracking-tight text-text-primary">
							{match.court} · {match.format}
						</p>
						<p className="mt-1 text-small text-text-secondary">{match.rules}</p>
					</div>

					<div className="hidden rounded-lg border border-border bg-bg-surface px-4 py-4 shadow-card md:block">
						<p className="mb-2 text-micro font-medium uppercase tracking-widest text-text-secondary">
							{match.setsLabel}
						</p>
						<div className="flex flex-col gap-2">
							<SidebarSetRow label="Set 1" value={setScore} live />
							<SidebarSetRow label="Set 2" value="—" />
							<SidebarSetRow label="Set 3" value="—" />
						</div>
					</div>

					<div className="hidden overflow-hidden rounded-lg border border-border bg-bg-surface shadow-card md:block">
						{MOCK_UMPIRE_PLAYERS.map((player) => (
							<div
								key={player.initials}
								className="border-b border-border last:border-b-0"
							>
								<PlayerRow
									name={player.name}
									initials={player.initials}
									teamLabel={player.teamLabel}
								/>
							</div>
						))}
					</div>

					<div className="mt-auto flex flex-col gap-2 pt-2">
						<button
							type="button"
							onClick={undoLastPoint}
							disabled={!canUndo}
							className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border-2 border-border-strong bg-transparent text-small font-medium uppercase tracking-widest text-text-primary transition-colors duration-default hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-40"
						>
							<UndoIcon />
							{match.undoCta}
						</button>
						<Link
							href="/submit"
							className="inline-flex min-h-11 items-center justify-center text-micro font-medium uppercase tracking-widest text-text-disabled transition-colors duration-default hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
						>
							{match.submitLink}
						</Link>
					</div>
				</aside>
			</div>
		</UmpireShell>
	);
}

LiveScoreView.displayName = "LiveScoreView";

function TeamPad({
	label,
	score,
	names,
	isLast,
	onPoint,
}: {
	label: string;
	score: number;
	names: readonly string[];
	isLast: boolean;
	onPoint: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onPoint}
			className={cn(
				"flex min-h-[220px] flex-col items-center justify-center rounded-lg border-[1.5px] px-2 py-4 text-center shadow-card transition-colors duration-default md:min-h-[280px] md:px-3 md:py-6 lg:min-h-[320px]",
				isLast
					? "border-accent/45 bg-accent-subtle shadow-accent"
					: "border-border bg-bg-surface hover:bg-bg-elevated",
			)}
		>
			<p className="text-micro font-medium uppercase tracking-widest text-text-secondary">
				{label}
			</p>
			<p
				className={cn(
					"mt-1 text-[72px] font-bold leading-none tracking-tighter md:text-[96px] lg:text-[112px]",
					isLast ? "text-accent" : "text-text-primary",
				)}
			>
				{score}
			</p>
			<p className="mt-2 text-small font-semibold leading-snug tracking-tight text-text-primary md:text-body">
				{names[0]}
				<br />
				{names[1]}
			</p>
			<span
				className={cn(
					"mt-4 inline-flex h-9 min-w-[112px] items-center justify-center gap-1.5 rounded-md border-[1.5px] px-3 text-label font-semibold uppercase tracking-widest md:h-11 md:min-w-[132px]",
					isLast
						? "border-accent bg-accent text-bg-base shadow-accent"
						: "border-border-strong bg-bg-elevated text-text-primary",
				)}
			>
				<PlusIcon />
				{MOCK_UMPIRE_MATCH.pointCta.replace("+ ", "")}
			</span>
			<span
				className={cn(
					"mt-2 text-micro font-semibold uppercase tracking-widest",
					isLast ? "text-accent" : "invisible",
				)}
			>
				{MOCK_UMPIRE_MATCH.lastPointFlag}
			</span>
		</button>
	);
}

function MobileSetCard({
	label,
	value,
	status,
	live = false,
}: {
	label: string;
	value: string;
	status: string;
	live?: boolean;
}) {
	return (
		<div
			className={cn(
				"rounded-md border px-1.5 py-2 text-center",
				live
					? "border-accent/30 bg-accent-subtle"
					: "border-border bg-bg-surface",
			)}
		>
			<p className="text-micro font-medium uppercase tracking-widest text-text-secondary">
				{label}
			</p>
			<p
				className={cn(
					"mt-1 text-heading font-bold tracking-tight",
					live
						? "text-accent"
						: value === "—"
							? "font-medium text-text-disabled"
							: "text-text-primary",
				)}
			>
				{value}
			</p>
			<p
				className={cn(
					"mt-1 text-micro font-semibold uppercase tracking-widest",
					live ? "text-accent" : "text-text-secondary",
				)}
			>
				{status}
			</p>
		</div>
	);
}

function SidebarSetRow({
	label,
	value,
	live = false,
}: {
	label: string;
	value: string;
	live?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex h-[52px] items-center justify-between rounded-md border px-3",
				live
					? "border-accent/30 bg-accent-subtle"
					: "border-border bg-bg-elevated",
			)}
		>
			<span
				className={cn(
					"text-label font-medium uppercase tracking-widest",
					live ? "text-accent" : "text-text-secondary",
				)}
			>
				{label}
			</span>
			<span
				className={cn(
					"text-heading font-bold tracking-tight",
					live
						? "text-accent"
						: value === "—"
							? "font-medium text-text-disabled"
							: "text-text-primary",
				)}
			>
				{value}
			</span>
		</div>
	);
}

function PlusIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="size-3.5 md:size-4"
			aria-hidden="true"
		>
			<path d="M12 5v14M5 12h14" />
		</svg>
	);
}

function UndoIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="size-[18px]"
			aria-hidden="true"
		>
			<path d="M9 14 4 9l5-5" />
			<path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5A5.5 5.5 0 0 1 14.5 20H11" />
		</svg>
	);
}

function CourtIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="size-3.5 shrink-0"
			aria-hidden="true"
		>
			<rect x="3.5" y="5.5" width="17" height="13" rx="2" />
			<path d="M3.5 12h17M12 5.5v13" />
		</svg>
	);
}
