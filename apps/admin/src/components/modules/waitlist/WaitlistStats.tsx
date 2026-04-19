"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
	type WaitlistStatsResponse,
	waitlistQueryKeys,
} from "@/lib/waitlist-admin";

async function fetchWaitlistStats(): Promise<WaitlistStatsResponse> {
	const res = await fetch("/api/waitlist/stats");
	if (!res.ok) {
		const err = (await res.json().catch(() => null)) as {
			error?: string;
		} | null;
		throw new Error(err?.error ?? "Failed to load statistics.");
	}
	return res.json() as Promise<WaitlistStatsResponse>;
}

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

export function WaitlistStats() {
	const query = useQuery({
		queryKey: waitlistQueryKeys.stats(),
		queryFn: fetchWaitlistStats,
	});

	const v = query.data ?? null;
	const num = (n: number | undefined) =>
		query.isSuccess && n !== undefined ? n : null;

	return (
		<div className="space-y-2">
			<h3 className="text-small font-semibold text-text-primary">Overview</h3>
			{query.isError ? (
				<p className="text-body text-error" role="alert">
					{query.error instanceof Error
						? query.error.message
						: "Something went wrong."}
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
