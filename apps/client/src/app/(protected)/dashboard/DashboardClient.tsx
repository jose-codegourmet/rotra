"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { DashboardSkeleton } from "@/components/modules/dashboard/dashboard-skeleton/DashboardSkeleton";
import { MapSearchOverlay } from "@/components/modules/dashboard/map-search-overlay/MapSearchOverlay";
import { SessionGridView } from "@/components/modules/dashboard/session-grid-view/SessionGridView";
import { SessionListView } from "@/components/modules/dashboard/session-list-view/SessionListView";
import { ViewToggle } from "@/components/modules/dashboard/view-toggle/ViewToggle";
import {
	DEFAULT_MAP_ZOOM,
	DEFAULT_RADIUS_KM,
	USER_LOCATION_ZOOM,
} from "@/constants/dashboard";
import { useActiveSession } from "@/hooks/useActiveSession/client";
import { useGeolocation } from "@/hooks/useGeolocation/client";
import { useSessionDiscovery } from "@/hooks/useSessionDiscovery/client";
import { useAppSelector } from "@/store/hooks";

const DashboardMap = dynamic(
	() =>
		import("@/components/modules/dashboard/dashboard-map/DashboardMap").then(
			(m) => m.DashboardMap,
		),
	{ ssr: false, loading: () => <DashboardSkeleton /> },
);

export function DashboardClient() {
	const viewMode = useAppSelector((s) => s.ui.dashboardViewMode);
	const { center, status, locationLabel, isUserLocation, refresh } =
		useGeolocation();

	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null,
	);
	const [nearbyOnly, setNearbyOnly] = useState(true);
	const [doublesOnly, setDoublesOnly] = useState(false);
	const [weekendOnly, setWeekendOnly] = useState(false);

	const filters = useMemo(() => {
		const base = {
			radiusKm: nearbyOnly ? DEFAULT_RADIUS_KM : 50,
			weekendOnly,
		};
		return doublesOnly ? { ...base, playersPerCourt: 4 } : base;
	}, [nearbyOnly, doublesOnly, weekendOnly]);

	const { data, isLoading } = useSessionDiscovery(
		center.lat,
		center.lng,
		filters,
	);
	useActiveSession();

	const sessions = data?.sessions ?? [];

	return (
		<div className="relative h-[calc(100dvh-4rem)] min-h-[480px] w-full overflow-hidden bg-bg-base">
			{viewMode === "map" ? (
				<DashboardMap
					sessions={sessions}
					center={center}
					zoom={isUserLocation ? USER_LOCATION_ZOOM : DEFAULT_MAP_ZOOM}
					selectedSessionId={selectedSessionId}
					onSelectSession={setSelectedSessionId}
					flyToUserLocation={isUserLocation}
				/>
			) : viewMode === "list" ? (
				<div className="h-full overflow-y-auto bg-bg-base">
					<SessionListView
						sessions={sessions}
						isLoading={isLoading}
					/>
				</div>
			) : (
				<div className="h-full overflow-y-auto bg-bg-base">
					<SessionGridView
						sessions={sessions}
						isLoading={isLoading}
					/>
				</div>
			)}

			<MapSearchOverlay
				locationLabel={locationLabel}
				geoStatus={status}
				nearbyOnly={nearbyOnly}
				doublesOnly={doublesOnly}
				weekendOnly={weekendOnly}
				onToggleNearby={() => setNearbyOnly((v) => !v)}
				onToggleDoubles={() => setDoublesOnly((v) => !v)}
				onToggleWeekend={() => setWeekendOnly((v) => !v)}
				onRecenter={refresh}
			/>
			<ViewToggle />
		</div>
	);
}
