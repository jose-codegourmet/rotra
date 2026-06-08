"use client";

import { useEffect, useRef } from "react";
import Map, { type MapRef, Popup } from "react-map-gl/mapbox";
import {
	resolveMapboxStyle,
	USER_LOCATION_ZOOM,
} from "@/constants/dashboard";
import type {
	SessionDiscoveryItem,
	SessionGeoPoint,
} from "@/types/session-discovery";
import { SessionMapPin } from "./SessionMapPin";
import { SessionPinTooltip } from "./SessionPinTooltip";

interface DashboardMapProps {
	sessions: SessionDiscoveryItem[];
	center: SessionGeoPoint;
	zoom?: number;
	selectedSessionId: string | null;
	onSelectSession: (id: string | null) => void;
	onJoinSession?: (sessionId: string) => void;
	flyToUserLocation?: boolean;
}

export function DashboardMap({
	sessions,
	center,
	zoom = USER_LOCATION_ZOOM,
	selectedSessionId,
	onSelectSession,
	onJoinSession,
	flyToUserLocation = false,
}: DashboardMapProps) {
	const mapRef = useRef<MapRef>(null);
	const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
	const selectedSession = sessions.find((s) => s.id === selectedSessionId);

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
				onClick={() => onSelectSession(null)}
			>
				{sessions
					.filter((s) => s.coordinates)
					.map((session) => (
						<SessionMapPin
							key={session.id}
							session={session}
							isSelected={selectedSessionId === session.id}
							onSelect={onSelectSession}
						/>
					))}

				{selectedSession?.coordinates && (
					<Popup
						longitude={selectedSession.coordinates.lng}
						latitude={selectedSession.coordinates.lat}
						anchor="bottom"
						offset={20}
						closeButton={false}
						closeOnClick={false}
						onClose={() => onSelectSession(null)}
					>
						{onJoinSession ? (
							<SessionPinTooltip
								session={selectedSession}
								onJoin={onJoinSession}
							/>
						) : (
							<SessionPinTooltip session={selectedSession} />
						)}
					</Popup>
				)}
			</Map>
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.05)_0%,transparent_70%)]" />
		</div>
	);
}
