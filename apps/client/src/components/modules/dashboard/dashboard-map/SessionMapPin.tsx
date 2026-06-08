"use client";

import { Bolt, Building2 } from "lucide-react";
import { Marker } from "react-map-gl/mapbox";
import { cn } from "@/lib/utils";
import type { SessionDiscoveryItem } from "@/types/session-discovery";
import { sessionMapPinVariants } from "./SessionMapPin.variants";

interface SessionMapPinProps {
	session: SessionDiscoveryItem;
	isSelected: boolean;
	onSelect: (sessionId: string) => void;
}

export function SessionMapPin({
	session,
	isSelected,
	onSelect,
}: SessionMapPinProps) {
	if (!session.coordinates) return null;

	const isLive = session.status === "active";
	const variant = isLive ? "live" : "open";

	return (
		<Marker
			longitude={session.coordinates.lng}
			latitude={session.coordinates.lat}
			anchor="bottom"
			onClick={(e) => {
				e.originalEvent.stopPropagation();
				onSelect(session.id);
			}}
		>
			<button
				type="button"
				aria-label={`${session.clubName} session`}
				className={cn(
					sessionMapPinVariants({ variant }),
					isSelected && sessionMapPinVariants({ variant: "selected" }),
				)}
			>
				{isLive ? (
					<Bolt size={18} fill="currentColor" strokeWidth={0} />
				) : (
					<Building2 size={14} strokeWidth={2} />
				)}
			</button>
		</Marker>
	);
}
