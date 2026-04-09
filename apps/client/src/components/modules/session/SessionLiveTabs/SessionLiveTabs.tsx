"use client";

import { useMemo, useState } from "react";

import type { SessionTabId } from "@/constants/mock-session-ui";
import {
	MOCK_ASSIGN_PLAYERS,
	MOCK_CHART_POINTS,
	MOCK_COURTS,
	MOCK_FINANCIAL_LINES,
	MOCK_KPIS,
	MOCK_LEDGER,
	MOCK_NEXT_QUEUE,
	MOCK_ROSTER,
	MOCK_STANDING_FULL,
	MOCK_STANDING_MINI,
} from "@/constants/mock-session-ui";

import { ActiveQueueView } from "../ActiveQueueView/ActiveQueueView";
import { AssignCourtModal } from "../AssignCourtModal/AssignCourtModal";
import { SessionFinancialsView } from "../SessionFinancialsView/SessionFinancialsView";
import { SessionStandingView } from "../SessionStandingView/SessionStandingView";
import { SessionStatisticsView } from "../SessionStatisticsView/SessionStatisticsView";
import { SessionTabNav } from "../SessionTabNav/SessionTabNav";

export interface SessionLiveTabsProps {
	/** Small label above tabs, e.g. club or session name */
	sessionLabel?: string;
	className?: string;
}

export function SessionLiveTabs({
	sessionLabel = "Live session",
	className,
}: SessionLiveTabsProps) {
	const [tab, setTab] = useState<SessionTabId>("queue");
	const [assignOpen, setAssignOpen] = useState(false);
	const [assignTitle, setAssignTitle] = useState("Assign court");

	const { inGameCourts, inactiveCourts } = useMemo(() => {
		const active = MOCK_COURTS.filter((c) => c.variant === "active");
		const empty = MOCK_COURTS.filter((c) => c.variant === "empty");
		return { inGameCourts: active, inactiveCourts: empty };
	}, []);

	return (
		<div className={className}>
			<div className="flex flex-col gap-4 mb-6">
				<p className="text-micro font-bold uppercase tracking-widest text-accent">
					{sessionLabel}
				</p>
				<SessionTabNav active={tab} onChange={setTab} />
			</div>

			{tab === "queue" ? (
				<ActiveQueueView
					inGameCourts={inGameCourts}
					inactiveCourts={inactiveCourts}
					nextQueue={MOCK_NEXT_QUEUE}
					standingRows={MOCK_STANDING_MINI}
					roster={MOCK_ROSTER}
					onAssignCourt={(courtId) => {
						const court = MOCK_COURTS.find((c) => c.id === courtId);
						setAssignTitle(
							court ? `Assign court — ${court.label}` : "Assign court",
						);
						setAssignOpen(true);
					}}
				/>
			) : null}
			{tab === "standing" ? (
				<SessionStandingView rows={MOCK_STANDING_FULL} />
			) : null}
			{tab === "statistics" ? (
				<SessionStatisticsView kpis={MOCK_KPIS} chartData={MOCK_CHART_POINTS} />
			) : null}
			{tab === "financials" ? (
				<SessionFinancialsView
					ledger={MOCK_LEDGER}
					lineItems={MOCK_FINANCIAL_LINES}
					totalCost="$636.50"
					profit="+$148.50"
				/>
			) : null}

			<AssignCourtModal
				open={assignOpen}
				onOpenChange={setAssignOpen}
				courtTitle={assignTitle}
				players={MOCK_ASSIGN_PLAYERS}
			/>
		</div>
	);
}
