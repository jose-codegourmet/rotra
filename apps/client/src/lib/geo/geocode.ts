export interface GeocodingSuggestion {
	id: string;
	placeName: string;
	text: string;
	/** Mapbox center as [lng, lat] */
	center: [number, number];
}

interface MapboxGeocodingFeature {
	id: string;
	place_name: string;
	text: string;
	center: [number, number];
}

interface MapboxGeocodingResponse {
	features?: MapboxGeocodingFeature[];
}

const GEOCODE_TYPES = "region,place,locality,neighborhood,address";

export async function forwardGeocode(
	query: string,
	token: string,
): Promise<GeocodingSuggestion[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	const url = new URL(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json`,
	);
	url.searchParams.set("access_token", token);
	url.searchParams.set("types", GEOCODE_TYPES);
	url.searchParams.set("country", "PH");
	url.searchParams.set("limit", "5");

	try {
		const res = await fetch(url.toString());
		if (!res.ok) return [];

		const data = (await res.json()) as MapboxGeocodingResponse;
		return (data.features ?? []).map((feature) => ({
			id: feature.id,
			placeName: feature.place_name,
			text: feature.text,
			center: feature.center,
		}));
	} catch {
		return [];
	}
}
