"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button/Button";
import type { PlayerQueueCardData } from "@/constants/mock-session-ui";
import { cn } from "@/lib/utils";

import { PlayerQueueCard } from "../PlayerQueueCard/PlayerQueueCard";
import { PlayerSearchBar } from "../PlayerSearchBar/PlayerSearchBar";

export interface AssignCourtModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	courtTitle: string;
	subtitle?: string;
	players: PlayerQueueCardData[];
	className?: string;
	onConfirm?: () => void;
}

export function AssignCourtModal({
	open,
	onOpenChange,
	courtTitle,
	subtitle = "Pro-league session · Active queue",
	players,
	className,
	onConfirm,
}: AssignCourtModalProps) {
	const [search, setSearch] = useState("");
	const [activeSlot, setActiveSlot] = useState(0);
	const [assignments, setAssignments] = useState<(string | null)[]>([
		null,
		null,
		null,
		null,
	]);

	useEffect(() => {
		if (!open) return;
		setSearch("");
		setActiveSlot(0);
		setAssignments([null, null, null, null]);
	}, [open]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return players;
		return players.filter((p) => p.name.toLowerCase().includes(q));
	}, [players, search]);

	const pickPlayer = useCallback(
		(player: PlayerQueueCardData) => {
			if (player.disabled) return;
			setAssignments((prev) => {
				const next = [...prev];
				next[activeSlot] = player.name;
				const empty = next.indexOf(null);
				if (empty !== -1) {
					queueMicrotask(() => setActiveSlot(empty));
				}
				return next;
			});
		},
		[activeSlot],
	);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-bg-base/80 backdrop-blur-md"
				aria-label="Close modal"
				onClick={() => onOpenChange(false)}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="assign-court-title"
				className={cn(
					"relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-bg-surface shadow-modal border border-border",
					className,
				)}
			>
				<div className="flex items-start justify-between gap-4 p-5 border-b border-border">
					<div>
						<p
							id="assign-court-title"
							className="text-title font-black uppercase tracking-tight text-accent"
						>
							{courtTitle}
						</p>
						<p className="text-micro text-text-disabled uppercase tracking-widest mt-1">
							{subtitle}
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="shrink-0"
						aria-label="Close"
						onClick={() => onOpenChange(false)}
					>
						<X className="size-5" />
					</Button>
				</div>

				<div className="p-5 flex flex-col gap-5">
					<div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
						<div className="flex flex-col gap-2">
							<SlotCell
								label={
									assignments[0] ??
									(activeSlot === 0 ? "Pick a player" : "Empty slot")
								}
								active={activeSlot === 0}
								filled={Boolean(assignments[0])}
								onClick={() => setActiveSlot(0)}
							/>
							<SlotCell
								label={
									assignments[1] ??
									(activeSlot === 1 ? "Pick a player" : "Empty slot")
								}
								active={activeSlot === 1}
								filled={Boolean(assignments[1])}
								onClick={() => setActiveSlot(1)}
							/>
						</div>
						<div className="flex items-center justify-center px-1">
							<span className="text-micro font-black text-text-disabled uppercase tracking-widest">
								VS
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<SlotCell
								label={
									assignments[2] ??
									(activeSlot === 2 ? "Pick a player" : "Empty slot")
								}
								active={activeSlot === 2}
								filled={Boolean(assignments[2])}
								onClick={() => setActiveSlot(2)}
							/>
							<SlotCell
								label={
									assignments[3] ??
									(activeSlot === 3 ? "Pick a player" : "Empty slot")
								}
								active={activeSlot === 3}
								filled={Boolean(assignments[3])}
								onClick={() => setActiveSlot(3)}
							/>
						</div>
					</div>

					<PlayerSearchBar
						value={search}
						onChange={setSearch}
						onFilterClick={() => {}}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
						{filtered.map((p) => (
							<PlayerQueueCard
								key={p.id}
								player={p}
								onClick={() => pickPlayer(p)}
							/>
						))}
					</div>

					<Button
						type="button"
						className="w-full h-11 uppercase font-black tracking-widest text-bg-base bg-gradient-to-br from-[#f1ffef] to-accent shadow-accent"
						onClick={() => {
							onConfirm?.();
							onOpenChange(false);
						}}
					>
						Confirm assignment
					</Button>
				</div>
			</div>
		</div>
	);
}

function SlotCell({
	label,
	active,
	filled,
	onClick,
}: {
	label: string;
	active: boolean;
	filled: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-lg min-h-[64px] px-3 py-2 text-left transition-colors duration-default",
				"border",
				active
					? "border-accent bg-accent/10 ring-1 ring-accent"
					: "border-border bg-bg-elevated",
				filled && "text-text-primary font-semibold text-small",
				!filled &&
					"text-micro font-bold uppercase tracking-widest text-text-disabled",
			)}
		>
			{label}
		</button>
	);
}
