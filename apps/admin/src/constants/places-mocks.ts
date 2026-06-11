import type { AddressPinValue } from "@/components/ui/address-pin-field/AddressPinField";
import type { PlaceRow } from "@/hooks/usePlaces/server";

export const MOCK_ADDRESS_PIN_VALUE: AddressPinValue = {
	name: "SM Seaside Badminton Court",
	address: "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
	latitude: 10.2841,
	longitude: 123.8607,
};

export const MOCK_PLACE_CONFIRMED: PlaceRow = {
	id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	name: "SM Seaside Badminton Court",
	address: "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
	latitude: 10.2841,
	longitude: 123.8607,
	status: "confirmed",
	submittedBy: null,
	reviewedBy: { id: "admin-id-0001", displayName: "Admin Jose" },
	createdAt: "2026-06-01T00:00:00.000Z",
};

export const MOCK_PLACE_UNREVIEWED: PlaceRow = {
	id: "e5f6g7h8-i9j0-1234-klmn-op5678901234",
	name: "Shuttle Masters Arena",
	address: "Hernan Cortes St, Mandaue City, Cebu",
	latitude: 10.3471,
	longitude: 123.9254,
	status: "unreviewed",
	submittedBy: { id: "player-id-0001", displayName: "Juan Dela Cruz" },
	reviewedBy: null,
	createdAt: "2026-06-09T00:00:00.000Z",
};

export const MOCK_PLACES_LIST: PlaceRow[] = [
	MOCK_PLACE_CONFIRMED,
	MOCK_PLACE_UNREVIEWED,
];
