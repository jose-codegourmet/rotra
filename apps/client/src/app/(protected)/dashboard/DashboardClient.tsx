"use client";

import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ActiveSessionBanner } from "@/components/modules/dashboard/active-session-banner/ActiveSessionBanner";
import { AlreadyInSessionDialog } from "@/components/modules/dashboard/already-in-session-dialog/AlreadyInSessionDialog";
import { DashboardSkeleton } from "@/components/modules/dashboard/dashboard-skeleton/DashboardSkeleton";
import { MapSearchOverlay } from "@/components/modules/dashboard/map-search-overlay/MapSearchOverlay";
import { QuickSessionButton } from "@/components/modules/dashboard/quick-session-button/QuickSessionButton";
import { QuickSessionSheet } from "@/components/modules/dashboard/quick-session-sheet/QuickSessionSheet";
import { SessionGridView } from "@/components/modules/dashboard/session-grid-view/SessionGridView";
import { SessionListView } from "@/components/modules/dashboard/session-list-view/SessionListView";
import { SessionUnavailableDialog } from "@/components/modules/dashboard/session-unavailable-dialog/SessionUnavailableDialog";
import { VenueSessionsModal } from "@/components/modules/dashboard/venue-sessions-modal/VenueSessionsModal";
import { ViewToggle } from "@/components/modules/dashboard/view-toggle/ViewToggle";
import { DEFAULT_MAP_ZOOM, USER_LOCATION_ZOOM } from "@/constants/dashboard";
import { useActiveSession } from "@/hooks/useActiveSession/client";
import { useGeolocation } from "@/hooks/useGeolocation/client";
import {
	sessionDiscoveryQueryKey,
	useSessionDiscovery,
} from "@/hooks/useSessionDiscovery/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardViewMode } from "@/store/slices/uiSlice";
import type {
	SessionDiscoveryFilters,
	SessionGeoPoint,
} from "@/types/session-discovery";

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
	const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
	const [nearbyOnly, setNearbyOnly] = useState(true);
	const [doublesOnly, setDoublesOnly] = useState(false);
	const [weekendOnly, setWeekendOnly] = useState(false);
	const [placeCenter, setPlaceCenter] = useState<SessionGeoPoint | null>(null);
	const [clubQuery, setClubQuery] = useState("");
	const [slotAvailability, setSlotAvailability] = useState<
		"full" | "not_full" | undefined
	>(undefined);
	const [sheetOpen, setSheetOpen] = useState(false);

	const effectiveCenter = placeCenter ?? center;

	const filters = useMemo<SessionDiscoveryFilters>(() => {
		const base: SessionDiscoveryFilters = {
			radiusKm: nearbyOnly ? 2 : 50,
			weekendOnly,
		};

		if (clubQuery.trim()) {
			base.clubQuery = clubQuery.trim();
		}

		if (slotAvailability) {
			base.slotAvailability = slotAvailability;
		}

		return doublesOnly ? { ...base, playersPerCourt: 4 } : base;
	}, [nearbyOnly, doublesOnly, weekendOnly, clubQuery, slotAvailability]);

	const { data, isLoading } = useSessionDiscovery(
		effectiveCenter.lat,
		effectiveCenter.lng,
		filters,
	);
	const { data: activeData } = useActiveSession();
	const active = activeData?.active ?? null;

	const sessions = data?.sessions ?? [];
	const venueGroups = data?.venueGroups ?? [];

	const venueModalGroup =
		venueGroups.find((group) => group.venueKey === venueModalKey) ?? null;

	const handleJoinSession = useCallback(
		async (sessionId: string) => {
			if (active && active.sessionId !== sessionId) {
				setBlockedDialogOpen(true);
				return;
			}

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
		[router, active],
	);

	const handleRefreshNearby = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: sessionDiscoveryQueryKey(
				effectiveCenter.lat,
				effectiveCenter.lng,
				filters,
			),
		});
		setSelectedVenueKey(null);
		setVenueModalKey(null);
	}, [effectiveCenter.lat, effectiveCenter.lng, filters, queryClient]);

	const handlePlaceSelect = useCallback((nextCenter: SessionGeoPoint) => {
		setPlaceCenter(nextCenter);
		setSelectedVenueKey(null);
		setVenueModalKey(null);
	}, []);

	const handleRecenter = useCallback(() => {
		setPlaceCenter(null);
		refresh();
	}, [refresh]);

	const handleMapError = useCallback(() => {
		dispatch(setDashboardViewMode("list"));
		toast.error("Map unavailable — showing list");
	}, [dispatch]);

	return (
		<div className="relative h-[calc(100dvh-4rem)] min-h-[480px] w-full overflow-hidden bg-bg-base">
			{viewMode === "map" ? (
				<div
					key="map"
					className="absolute inset-0 z-0 animate-in fade-in duration-150 slide-in-from-bottom-1"
				>
					<DashboardMap
						venueGroups={venueGroups}
						center={effectiveCenter}
						zoom={isUserLocation ? USER_LOCATION_ZOOM : DEFAULT_MAP_ZOOM}
						selectedVenueKey={selectedVenueKey}
						onSelectVenue={setSelectedVenueKey}
						onOpenVenueModal={setVenueModalKey}
						onJoinSession={handleJoinSession}
						flyToUserLocation={isUserLocation && placeCenter == null}
						{...(placeCenter ? { flyToCenter: placeCenter } : {})}
						onMapError={handleMapError}
					/>
				</div>
			) : viewMode === "list" ? (
				<div
					key="list"
					className="absolute inset-0 z-0 animate-in fade-in duration-150 slide-in-from-bottom-1"
				>
					<SessionListView
						sessions={sessions}
						isLoading={isLoading}
						onJoinSession={handleJoinSession}
					/>
				</div>
			) : (
				<div
					key="grid"
					className="absolute inset-0 z-0 animate-in fade-in duration-150 slide-in-from-bottom-1"
				>
					<SessionGridView
						sessions={sessions}
						isLoading={isLoading}
						onJoinSession={handleJoinSession}
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
				onRecenter={handleRecenter}
				onPlaceSelect={handlePlaceSelect}
				clubQuery={clubQuery}
				onClubQueryChange={setClubQuery}
				venueGroups={venueGroups}
				slotAvailability={slotAvailability}
				onSlotAvailabilityChange={setSlotAvailability}
			/>
			<ViewToggle />

			{active ? (
				<ActiveSessionBanner
					session={active}
					onNavigate={() => router.push(active.href)}
					className="absolute top-4 left-4 right-4 z-[25]"
				/>
			) : null}

			<QuickSessionButton
				variant={active ? "resume" : "create"}
				onClick={() => {
					if (active) {
						router.push(active.href);
					} else {
						setSheetOpen(true);
					}
				}}
			/>
			{!active ? (
				<QuickSessionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
			) : null}

			<VenueSessionsModal
				group={venueModalGroup}
				open={venueModalKey != null}
				onOpenChange={(open) => {
					if (!open) setVenueModalKey(null);
				}}
				onJoin={handleJoinSession}
			/>

			{active ? (
				<AlreadyInSessionDialog
					open={blockedDialogOpen}
					onOpenChange={setBlockedDialogOpen}
					activeSession={active}
					onGoToSession={() => {
						setBlockedDialogOpen(false);
						router.push(active.href);
					}}
				/>
			) : null}

			<SessionUnavailableDialog
				open={unavailableDialogOpen}
				onOpenChange={setUnavailableDialogOpen}
				onRefresh={handleRefreshNearby}
			/>
		</div>
	);
}
