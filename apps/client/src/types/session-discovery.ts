export type DashboardViewMode = "map" | "list" | "grid";

export interface SessionGeoPoint {
	lat: number;
	lng: number;
}

export interface SessionDiscoveryItem {
	id: string;
	clubId: string;
	clubName: string;
	location: string;
	venueAddress: string | null;
	coordinates: SessionGeoPoint | null;
	/**
	 * Stable key for grouping sessions at the same physical court/venue.
	 * Derived by rounding lat/lng to 3 decimal places (~111m grid) in the API mapper.
	 */
	venueKey: string;
	dateTime: string;
	endTime: string | null;
	status: "open" | "active";
	scheduleType: "mmr" | "fun_games" | null;
	origin: "player_organized" | "club_queue";
	totalSlots: number;
	acceptedCount: number;
	recentPlayers: SessionPlayerPreview[];
	distanceKm: number | null;
	playersPerCourt: number;
}

export interface SessionPlayerPreview {
	id: string;
	displayName: string;
	avatarUrl: string | null;
}

export interface VenueSessionGroup {
	venueKey: string;
	coordinates: SessionGeoPoint;
	venueName: string;
	venueAddress: string | null;
	distanceKm: number | null;
	sessions: SessionDiscoveryItem[];
}

export interface SessionDiscoveryFilters {
	radiusKm: number;
	placeQuery?: string;
	clubQuery?: string;
	slotAvailability?: "full" | "not_full";
	scheduleType?: "mmr" | "fun_games";
	playersPerCourt?: number;
	weekendOnly?: boolean;
}

export interface ActiveSessionSummary {
	sessionId: string;
	clubName: string;
	location: string;
	status: "open" | "active";
	playerStatus: string;
	admissionStatus: string;
	courtHint: string | null;
	href: string;
}

export interface ActiveSessionResponse {
	active: ActiveSessionSummary | null;
}

export interface SessionDiscoveryResponse {
	sessions: SessionDiscoveryItem[];
	venueGroups: VenueSessionGroup[];
}
