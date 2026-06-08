"use client";

import { useCallback, useEffect, useRef } from "react";
import Map, { type MapRef, Popup } from "react-map-gl/mapbox";
import {
	resolveMapboxStyle,
	USER_LOCATION_ZOOM,
} from "@/constants/dashboard";
import type { SessionGeoPoint, VenueSessionGroup } from "@/types/session-discovery";
import { VenuePin } from "./VenuePin";
import { VenuePinTooltip } from "./VenuePinTooltip";

interface DashboardMapProps {
	venueGroups: VenueSessionGroup[];
	center: SessionGeoPoint;
	zoom?: number;
	selectedVenueKey: string | null;
	onSelectVenue: (venueKey: string | null) => void;
	onOpenVenueModal: (venueKey: string) => void;
	onJoinSession: (sessionId: string) => void;
	flyToUserLocation?: boolean;
	onMapError?: () => void;
}

export function DashboardMap({
	venueGroups,
	center,
	zoom = USER_LOCATION_ZOOM,
	selectedVenueKey,
	onSelectVenue,
	onOpenVenueModal,
	onJoinSession,
	flyToUserLocation = false,
	onMapError,
}: DashboardMapProps) {
	const mapRef = useRef<MapRef>(null);
	const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

	const selectedGroup = venueGroups.find(
		(group) => group.venueKey === selectedVenueKey,
	);

	const clearOpenTimer = useCallback(() => {
		if (openTimerRef.current) {
			clearTimeout(openTimerRef.current);
			openTimerRef.current = null;
		}
	}, []);

	const clearCloseTimer = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
	}, []);

	const scheduleOpen = useCallback(
		(venueKey: string) => {
			clearCloseTimer();
			clearOpenTimer();
			openTimerRef.current = setTimeout(() => onSelectVenue(venueKey), 100);
		},
		[clearCloseTimer, clearOpenTimer, onSelectVenue],
	);

	const scheduleClose = useCallback(() => {
		clearOpenTimer();
		clearCloseTimer();
		closeTimerRef.current = setTimeout(() => onSelectVenue(null), 200);
	}, [clearCloseTimer, clearOpenTimer, onSelectVenue]);

	const cancelClose = useCallback(() => {
		clearCloseTimer();
	}, [clearCloseTimer]);

	useEffect(() => {
		return () => {
			clearOpenTimer();
			clearCloseTimer();
		};
	}, [clearCloseTimer, clearOpenTimer]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !flyToUserLocation) return;

		map.flyTo({
			center: [center.lng, center.lat],
			zoom,
			duration: 1200,
			essential: true,
		});
	}, [center.lat, center.lng, zoom, flyToUserLocation]);

	if (!token) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-bg-elevated p-8 text-center">
				<div>
					<p className="text-small font-bold uppercase tracking-widest text-text-primary">
						Map unavailable
					</p>
					<p className="mt-2 text-body text-text-secondary">
						Set{" "}
						<code className="text-accent">NEXT_PUBLIC_MAPBOX_TOKEN</code> to
						enable the discovery map.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full">
			<Map
				ref={mapRef}
				mapboxAccessToken={token}
				initialViewState={{
					longitude: center.lng,
					latitude: center.lat,
					zoom,
				}}
				style={{ width: "100%", height: "100%" }}
				mapStyle={resolveMapboxStyle()}
				attributionControl={false}
				reuseMaps
				onClick={() => onSelectVenue(null)}
				onMoveStart={() => onSelectVenue(null)}
				onError={() => onMapError?.()}
			>
				{venueGroups.map((group) => (
					<VenuePin
						key={group.venueKey}
						group={group}
						isSelected={selectedVenueKey === group.venueKey}
						onSelect={onSelectVenue}
						onHoverStart={scheduleOpen}
						onHoverEnd={scheduleClose}
					/>
				))}

				{selectedGroup && (
					<Popup
						longitude={selectedGroup.coordinates.lng}
						latitude={selectedGroup.coordinates.lat}
						anchor="bottom"
						offset={24}
						closeButton={false}
						closeOnClick={false}
						onClose={() => onSelectVenue(null)}
					>
						<VenuePinTooltip
							group={selectedGroup}
							onJoin={onJoinSession}
							onOpenModal={() => onOpenVenueModal(selectedGroup.venueKey)}
							onMouseEnter={cancelClose}
							onMouseLeave={scheduleClose}
						/>
					</Popup>
				)}
			</Map>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.05)_0%,transparent_70%)]" />
		</div>
	);
}
