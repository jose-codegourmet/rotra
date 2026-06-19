import type { PlaceRow } from "@/hooks/usePlaces/server";

import type { EditPlaceFormValues } from "./schema";

export function defaultEditPlaceValues(place: PlaceRow): EditPlaceFormValues {
	return {
		name: place.name,
		description: place.description ?? "",
		phone: place.phone ?? "",
		website: place.website ?? "",
		location: {
			name: place.name,
			address: place.address,
			latitude: place.latitude,
			longitude: place.longitude,
		},
	};
}
