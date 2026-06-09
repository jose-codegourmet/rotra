import { MOCK_SESSION_DISCOVERY } from "@/constants/mock-session-discovery";
import { haversineKm } from "@/lib/geo/haversine";
import type {
	SessionDiscoveryFilters,
	SessionDiscoveryItem,
	SessionGeoPoint,
	VenueSessionGroup,
} from "@/types/session-discovery";

const VENUE_KEY_PRECISION = 3;

export function deriveVenueKey(lat: number, lng: number): string {
	return `${lat.toFixed(VENUE_KEY_PRECISION)}_${lng.toFixed(VENUE_KEY_PRECISION)}`;
}

function isWeekend(iso: string): boolean {
	const day = new Date(iso).getDay();
	return day === 0 || day === 6;
}

function applyFilters(
	sessions: SessionDiscoveryItem[],
	filters: SessionDiscoveryFilters,
): SessionDiscoveryItem[] {
	let result = sessions;

	if (filters.clubQuery?.trim()) {
		const q = filters.clubQuery.trim().toLowerCase();
		result = result.filter((s) => s.clubName.toLowerCase().includes(q));
	}

	if (filters.scheduleType) {
		result = result.filter((s) => s.scheduleType === filters.scheduleType);
	}

	if (filters.playersPerCourt != null) {
		result = result.filter(
			(s) => s.playersPerCourt === filters.playersPerCourt,
		);
	}

	if (filters.weekendOnly) {
		result = result.filter((s) => isWeekend(s.dateTime));
	}

	if (filters.slotAvailability === "full") {
		result = result.filter((s) => s.acceptedCount >= s.totalSlots);
	} else if (filters.slotAvailability === "not_full") {
		result = result.filter((s) => s.acceptedCount < s.totalSlots);
	}

	return result;
}

function withDistance(
	sessions: SessionDiscoveryItem[],
	origin: SessionGeoPoint,
	radiusKm: number,
): SessionDiscoveryItem[] {
	return sessions
		.map((session) => {
			if (!session.coordinates) {
				return { ...session, distanceKm: null };
			}
			const distanceKm = haversineKm(origin, session.coordinates);
			return { ...session, distanceKm };
		})
		.filter(
			(session) => session.distanceKm == null || session.distanceKm <= radiusKm,
		)
		.sort((a, b) => {
			const distA = a.distanceKm ?? Number.POSITIVE_INFINITY;
			const distB = b.distanceKm ?? Number.POSITIVE_INFINITY;
			if (distA !== distB) return distA - distB;
			return a.dateTime.localeCompare(b.dateTime);
		});
}

/**
 * Phase 0 stub — returns mock sessions filtered by radius and filters.
 * Wire to Prisma in a later phase when venue coordinates are populated.
 */
export function getNearbySessions(
	origin: SessionGeoPoint,
	filters: SessionDiscoveryFilters,
): SessionDiscoveryItem[] {
	const filtered = applyFilters([...MOCK_SESSION_DISCOVERY], filters);
	return withDistance(filtered, origin, filters.radiusKm);
}

export function groupSessionsByVenue(
	sessions: SessionDiscoveryItem[],
): VenueSessionGroup[] {
	const groups = new Map<string, VenueSessionGroup>();

	for (const session of sessions) {
		if (!session.coordinates) continue;

		const existing = groups.get(session.venueKey);
		if (existing) {
			existing.sessions.push(session);
			continue;
		}

		groups.set(session.venueKey, {
			venueKey: session.venueKey,
			coordinates: session.coordinates,
			venueName: session.location,
			venueAddress: session.venueAddress,
			distanceKm: session.distanceKm,
			sessions: [session],
		});
	}

	return [...groups.values()]
		.map((group) => ({
			...group,
			sessions: [...group.sessions].sort((a, b) =>
				a.dateTime.localeCompare(b.dateTime),
			),
		}))
		.sort((a, b) => {
			const distA = a.distanceKm ?? Number.POSITIVE_INFINITY;
			const distB = b.distanceKm ?? Number.POSITIVE_INFINITY;
			return distA - distB;
		});
}

export function buildDiscoveryResponse(
	origin: SessionGeoPoint,
	filters: SessionDiscoveryFilters,
) {
	const sessions = getNearbySessions(origin, filters);
	const venueGroups = groupSessionsByVenue(sessions);
	return { sessions, venueGroups };
}
