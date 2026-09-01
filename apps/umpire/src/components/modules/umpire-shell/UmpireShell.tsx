import Link from "next/link";
import type { ReactNode } from "react";
import { MOCK_UMPIRE_MATCH } from "@/constants/mock-umpire-match";
import { cn } from "@/lib/utils";

export type UmpireShellProps = {
	youStatus: string;
	children: ReactNode;
};

export function UmpireShell({ youStatus, children }: UmpireShellProps) {
	const match = MOCK_UMPIRE_MATCH;

	return (
		<div className="flex min-h-dvh bg-bg-base">
			<aside className="hidden w-60 shrink-0 flex-col border-r border-border px-4 py-8 lg:flex lg:w-64">
				<BrandMark />
				<div className="mt-8 rounded-md bg-bg-surface px-3 py-3 shadow-card">
					<p className="text-micro font-medium uppercase tracking-widest text-text-secondary">
						{match.courtLabel}
					</p>
					<p className="mt-1 text-small font-semibold text-text-primary">
						{match.venue}
					</p>
					<p className="mt-1 text-small text-text-secondary">
						{match.court} · {match.format}
					</p>
					<p className="text-small text-text-secondary">{match.window}</p>
				</div>
				<nav className="mt-6 flex flex-col gap-1" aria-label="Umpire">
					<Link
						href="/scoreboard"
						className="flex items-center gap-2 rounded-md bg-accent/15 px-3 py-2 text-small font-semibold text-accent ring-1 ring-inset ring-accent/25"
						aria-current="page"
					>
						<CourtIcon />
						{match.scoreboardNav}
					</Link>
				</nav>
				<div className="mt-auto flex items-center gap-3 rounded-lg border border-accent/25 bg-accent/15 px-3 py-3">
					<span
						className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-small font-semibold text-accent"
						aria-hidden="true"
					>
						{match.umpireInitials}
					</span>
					<div className="min-w-0">
						<p className="truncate text-small font-semibold text-accent">
							{match.umpireName}
						</p>
						<p className="truncate text-micro text-accent/80">{youStatus}</p>
					</div>
				</div>
			</aside>

			<div className="flex min-h-dvh min-w-0 flex-1 flex-col">
				<header className="flex items-end justify-between gap-4 border-b border-border px-4 py-4 md:px-8 lg:hidden">
					<BrandMark />
					<UmpireChip />
				</header>
				<div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-4 pb-4 md:max-w-none md:px-8 md:pb-8">
					{children}
				</div>
			</div>
		</div>
	);
}

UmpireShell.displayName = "UmpireShell";

export function BrandMark({ className }: { className?: string }) {
	return (
		<div className={className}>
			<p className="text-heading font-bold uppercase tracking-wide text-text-primary">
				{MOCK_UMPIRE_MATCH.brand}
			</p>
			<p className="text-small text-text-secondary">
				{MOCK_UMPIRE_MATCH.tagline}
			</p>
		</div>
	);
}

export function UmpireChip({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex h-[22px] items-center gap-1.5 rounded-full border border-accent/20 bg-accent-subtle px-2 text-micro font-medium uppercase tracking-widest text-accent",
				className,
			)}
		>
			<span
				className="size-1.5 rounded-full bg-accent shadow-accent"
				aria-hidden="true"
			/>
			{MOCK_UMPIRE_MATCH.umpireChip}
		</span>
	);
}

export function StatusPill({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"flex items-center gap-2 text-micro font-medium uppercase tracking-widest text-text-secondary",
				className,
			)}
		>
			<span
				className="size-1.5 shrink-0 rounded-full bg-accent shadow-accent"
				aria-hidden="true"
			/>
			{children}
		</p>
	);
}

export function PlayerRow({
	name,
	initials,
	teamLabel,
	winning = false,
}: {
	name: string;
	initials: string;
	teamLabel: string;
	winning?: boolean;
}) {
	return (
		<div className="flex h-16 items-center gap-3 px-4">
			<span
				className={cn(
					"inline-flex size-10 shrink-0 items-center justify-center rounded-full border text-label font-semibold tracking-wide",
					winning
						? "border-accent/30 bg-accent-subtle text-accent"
						: "border-border-strong bg-bg-elevated text-text-primary",
				)}
				aria-hidden="true"
			>
				{initials}
			</span>
			<div className="min-w-0">
				<p className="truncate text-body font-semibold tracking-tight text-text-primary">
					{name}
				</p>
				<p className="mt-0.5 text-label text-text-secondary">{teamLabel}</p>
			</div>
		</div>
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
			className="size-4 shrink-0"
			aria-hidden="true"
		>
			<rect x="3.5" y="5.5" width="17" height="13" rx="2" />
			<path d="M3.5 12h17M12 5.5v13" />
		</svg>
	);
}
