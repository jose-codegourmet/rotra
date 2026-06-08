"use client";

import { Loader2, MapPin, SlidersHorizontal } from "lucide-react";
import type { GeolocationStatus } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";

interface MapSearchOverlayProps {
	locationLabel: string;
	geoStatus: GeolocationStatus;
	nearbyOnly: boolean;
	doublesOnly: boolean;
	weekendOnly: boolean;
	onToggleNearby: () => void;
	onToggleDoubles: () => void;
	onToggleWeekend: () => void;
	onRecenter?: () => void;
}

export function MapSearchOverlay({
	locationLabel,
	geoStatus,
	nearbyOnly,
	doublesOnly,
	weekendOnly,
	onToggleNearby,
	onToggleDoubles,
	onToggleWeekend,
	onRecenter,
}: MapSearchOverlayProps) {
	const displayLocation =
		geoStatus === "loading"
			? "Locating you…"
			: locationLabel || "Set your location";

	return (
		<div className="pointer-events-auto absolute top-4 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4">
			<div className="rounded-2xl border border-outline-variant/10 bg-bg-base/90 p-4 shadow-2xl backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onRecenter}
						className="flex flex-1 items-center gap-3 rounded-xl border border-outline-variant/10 bg-bg-elevated px-4 py-3 text-left"
						title="Re-center on your location"
					>
						{geoStatus === "loading" ? (
							<Loader2
								size={18}
								className="shrink-0 animate-spin text-accent"
							/>
						) : (
							<MapPin size={18} className="shrink-0 text-accent" />
						)}
						<span className="truncate text-sm font-medium text-text-primary">
							{displayLocation}
						</span>
					</button>
					<button
						type="button"
						className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-outline-variant/10 bg-bg-elevated text-text-secondary"
						aria-label="Filters"
					>
						<SlidersHorizontal size={18} />
					</button>
				</div>
				<div className="mt-3 flex gap-2 overflow-x-auto pb-1">
					<FilterChip
						active={nearbyOnly}
						onClick={onToggleNearby}
						label="Nearby (< 2km)"
					/>
					<FilterChip
						active={doublesOnly}
						onClick={onToggleDoubles}
						label="Doubles Only"
					/>
					<FilterChip
						active={weekendOnly}
						onClick={onToggleWeekend}
						label="Weekend"
					/>
				</div>
			</div>
		</div>
	);
}

function FilterChip({
	active,
	onClick,
	label,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap",
				active
					? "border-accent/20 bg-accent/5 text-accent"
					: "border-outline-variant/10 bg-bg-elevated text-text-secondary",
			)}
		>
			{label}
		</button>
	);
}
