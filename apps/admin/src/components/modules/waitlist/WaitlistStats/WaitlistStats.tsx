"use client";

import { cn } from "@/lib/utils";
import type { WaitlistStatsResponse } from "@/lib/waitlist-admin";

const numberFmt = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 0,
});

function StatCard({
	label,
	value,
	emphasis,
}: {
	label: string;
	value: number | null;
	emphasis?: boolean;
}) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-bg-surface px-4 py-3",
				emphasis && "ring-1 ring-accent/25",
			)}
		>
			<p className="text-micro font-bold uppercase tracking-widest text-text-secondary">
				{label}
			</p>
			<p
				className={cn(
					"mt-1 tabular-nums text-text-primary",
					emphasis ? "text-heading font-semibold" : "text-body",
				)}
			>
				{value === null ? "—" : numberFmt.format(value)}
			</p>
		</div>
	);
}

export type WaitlistStatsProps = {
	stats: WaitlistStatsResponse | null;
	isLoading?: boolean;
	isError?: boolean;
	error?: Error | null;
};

export function WaitlistStats({
	stats,
	isLoading = false,
	isError = false,
	error = null,
}: WaitlistStatsProps) {
	const v = stats;
	const num = (n: number | undefined) =>
		!isLoading && !isError && v && n !== undefined ? n : null;

	return (
		<div className="space-y-2">
			<h3 className="text-small font-semibold text-text-primary">Overview</h3>
			{isError ? (
				<p className="text-body text-error" role="alert">
					{error instanceof Error ? error.message : "Something went wrong."}
				</p>
			) : null}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard label="Total signups" value={num(v?.total)} emphasis />
				<StatCard label="Last 24 hours" value={num(v?.last24h)} />
				<StatCard label="Last 7 days" value={num(v?.last7d)} />
				<StatCard label="Last 30 days" value={num(v?.last30d)} />
			</div>
		</div>
	);
}

WaitlistStats.displayName = "WaitlistStats";
