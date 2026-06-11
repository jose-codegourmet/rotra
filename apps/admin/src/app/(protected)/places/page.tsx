import { db } from "@rotra/db";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import { PlacesClient } from "@/app/(protected)/places/PlacesClient";
import { placesQueryKey } from "@/hooks/usePlaces/queryKey";
import type { ListPlacesResponse, PlaceRow } from "@/hooks/usePlaces/server";
import { requireAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
	title: "Places — ROTRA Admin",
};

function serializePlaces(
	places: Array<{
		id: string;
		name: string;
		address: string;
		latitude: number;
		longitude: number;
		status: PlaceRow["status"];
		createdAt: Date;
		submittedBy: { id: string; name: string } | null;
		reviewedBy: { id: string; name: string } | null;
	}>,
): PlaceRow[] {
	return places.map((place) => ({
		id: place.id,
		name: place.name,
		address: place.address,
		latitude: place.latitude,
		longitude: place.longitude,
		status: place.status,
		submittedBy: place.submittedBy
			? {
					id: place.submittedBy.id,
					displayName: place.submittedBy.name,
				}
			: null,
		reviewedBy: place.reviewedBy
			? {
					id: place.reviewedBy.id,
					displayName: place.reviewedBy.name,
				}
			: null,
		createdAt: place.createdAt.toISOString(),
	}));
}

export default async function PlacesPage() {
	await requireAdminSession();

	const places = await db.place.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			submittedBy: { select: { id: true, name: true } },
			reviewedBy: { select: { id: true, name: true } },
		},
	});

	const initialPlaces: ListPlacesResponse = {
		places: serializePlaces(places),
	};

	const queryClient = new QueryClient();
	queryClient.setQueryData(placesQueryKey(), initialPlaces);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PlacesClient initialPlaces={initialPlaces} />
		</HydrationBoundary>
	);
}
