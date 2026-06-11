import type { PlaceStatus } from "@prisma/client";
import { db } from "@rotra/db";
import { NextResponse } from "next/server";
import type { PlaceRow } from "@/hooks/usePlaces/server";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

function parseStatusFilter(value: string | null): PlaceStatus | undefined {
	if (value === "confirmed" || value === "unreviewed") {
		return value;
	}
	return undefined;
}

function serializePlace(place: {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	status: PlaceStatus;
	createdAt: Date;
	submittedBy: { id: string; name: string } | null;
	reviewedBy: { id: string; name: string } | null;
}): PlaceRow {
	return {
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
	};
}

function placesErrorResponse(error: unknown, context: string) {
	if (error instanceof AdminSessionError) {
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);
	}
	console.error(context, error);
	return NextResponse.json(
		{ error: "Failed to load places." },
		{ status: 500 },
	);
}

export async function GET(req: Request) {
	try {
		await requireAdminSession();
		const { searchParams } = new URL(req.url);
		const statusFilter = parseStatusFilter(searchParams.get("status"));

		const places = await db.place.findMany({
			...(statusFilter ? { where: { status: statusFilter } } : {}),
			orderBy: { createdAt: "desc" },
			include: {
				submittedBy: { select: { id: true, name: true } },
				reviewedBy: { select: { id: true, name: true } },
			},
		});

		return NextResponse.json({
			places: places.map(serializePlace),
		});
	} catch (error) {
		return placesErrorResponse(error, "[places list]");
	}
}
