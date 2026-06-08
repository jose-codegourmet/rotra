"use client";

import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardSkeleton } from "@/components/modules/dashboard/dashboard-skeleton/DashboardSkeleton";
import { MapSearchOverlay } from "@/components/modules/dashboard/map-search-overlay/MapSearchOverlay";
import { SessionGridView } from "@/components/modules/dashboard/session-grid-view/SessionGridView";
import { SessionListView } from "@/components/modules/dashboard/session-list-view/SessionListView";
import { SessionUnavailableDialog } from "@/components/modules/dashboard/session-unavailable-dialog/SessionUnavailableDialog";
import { VenueSessionsModal } from "@/components/modules/dashboard/venue-sessions-modal/VenueSessionsModal";
import { ViewToggle } from "@/components/modules/dashboard/view-toggle/ViewToggle";
import {
	DEFAULT_MAP_ZOOM,
	DEFAULT_RADIUS_KM,
	USER_LOCATION_ZOOM,
} from "@/constants/dashboard";
import { useActiveSession } from "@/hooks/useActiveSession/client";
import { useGeolocation } from "@/hooks/useGeolocation/client";
import {
	sessionDiscoveryQueryKey,
	useSessionDiscovery,
} from "@/hooks/useSessionDiscovery/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardViewMode } from "@/store/slices/uiSlice";
import type { SessionDiscoveryFilters } from "@/types/session-discovery";

const DashboardMap = dynamic(
	() =>
		import("@/components/modules/dashboard/dashboard-map/DashboardMap").then(
			(m) => m.DashboardMap,
		),
	{ ssr: false, loading: () => <DashboardSkeleton /> },
);

export function DashboardClient() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const dispatch = useAppDispatch();
	const viewMode = useAppSelector((s) => s.ui.dashboardViewMode);
	const { center, status, locationLabel, isUserLocation, refresh } =
		useGeolocation();

	const [selectedVenueKey, setSelectedVenueKey] = useState<string | null>(null);
	const [venueModalKey, setVenueModalKey] = useState<string | null>(null);
	const [unavailableDialogOpen, setUnavailableDialogOpen] = useState(false);
	const [nearbyOnly, setNearbyOnly] = useState(true);
	const [doublesOnly, setDoublesOnly] = useState(false);
	const [weekendOnly, setWeekendOnly] = useState(false);

	const filters = useMemo<SessionDiscoveryFilters>(() => {
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
	const venueGroups = data?.venueGroups ?? [];

	const venueModalGroup =
		venueGroups.find((group) => group.venueKey === venueModalKey) ?? null;

	const handleJoinSession = useCallback(
		async (sessionId: string) => {
			try {
				const res = await fetch(`/api/sessions/${sessionId}`);
				if (!res.ok) {
					setUnavailableDialogOpen(true);
					return;
				}

				const body = (await res.json()) as { joinable?: boolean };
				if (body.joinable === false) {
					setUnavailableDialogOpen(true);
					return;
				}

				router.push(`/sessions/${sessionId}`);
			} catch {
				setUnavailableDialogOpen(true);
			}
		},
		[router],
	);

	const handleRefreshNearby = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: sessionDiscoveryQueryKey(center.lat, center.lng, filters),
		});
		setSelectedVenueKey(null);
		setVenueModalKey(null);
	}, [center.lat, center.lng, filters, queryClient]);

	const handleMapError = useCallback(() => {
		dispatch(setDashboardViewMode("list"));
		toast.error("Map unavailable — showing list");
	}, [dispatch]);

	return (
		<div className="relative h-[calc(100dvh-4rem)] min-h-[480px] w-full overflow-hidden bg-bg-base">
			{viewMode === "map" ? (
				<DashboardMap
					venueGroups={venueGroups}
					center={center}
					zoom={isUserLocation ? USER_LOCATION_ZOOM : DEFAULT_MAP_ZOOM}
					selectedVenueKey={selectedVenueKey}
					onSelectVenue={setSelectedVenueKey}
					onOpenVenueModal={setVenueModalKey}
					onJoinSession={handleJoinSession}
					flyToUserLocation={isUserLocation}
					onMapError={handleMapError}
				/>
			) : viewMode === "list" ? (
				<div className="h-full overflow-y-auto bg-bg-base">
					<SessionListView sessions={sessions} isLoading={isLoading} />
				</div>
			) : (
				<div className="h-full overflow-y-auto bg-bg-base">
					<SessionGridView sessions={sessions} isLoading={isLoading} />
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

			<VenueSessionsModal
				group={venueModalGroup}
				open={venueModalKey != null}
				onOpenChange={(open) => {
					if (!open) setVenueModalKey(null);
				}}
				onJoin={handleJoinSession}
			/>

			<SessionUnavailableDialog
				open={unavailableDialogOpen}
				onOpenChange={setUnavailableDialogOpen}
				onRefresh={handleRefreshNearby}
			/>
		</div>
	);
}
