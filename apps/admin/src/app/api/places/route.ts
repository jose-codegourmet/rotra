import type { PlaceStatus } from "@prisma/client";
import { db } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { PlaceRow } from "@/hooks/usePlaces/server";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const createPlaceBodySchema = z.object({
	name: z.string().min(2).max(120),
	address: z.string().min(5),
	latitude: z.number(),
	longitude: z.number(),
	description: z.string().max(500).optional(),
	phone: z.string().max(30).optional(),
	website: z.union([z.string().url(), z.literal("")]).optional(),
});

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
	description: string | null;
	phone: string | null;
	website: string | null;
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
		description: place.description,
		phone: place.phone,
		website: place.website,
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

function placesErrorResponse(error: unknown, context: string, fallback: string) {
	if (error instanceof AdminSessionError) {
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);
	}
	console.error(context, error);
	return NextResponse.json({ error: fallback }, { status: 500 });
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
		return placesErrorResponse(error, "[places list]", "Failed to load places.");
	}
}

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = createPlaceBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		const now = new Date();

		const place = await db.place.create({
			data: {
				name: parsed.data.name,
				address: parsed.data.address,
				latitude: parsed.data.latitude,
				longitude: parsed.data.longitude,
				...(parsed.data.description
					? { description: parsed.data.description }
					: {}),
				...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
				...(parsed.data.website ? { website: parsed.data.website } : {}),
				status: "confirmed",
				reviewedById: session.profileId,
				reviewedAt: now,
				submittedById: null,
			},
			include: {
				submittedBy: { select: { id: true, name: true } },
				reviewedBy: { select: { id: true, name: true } },
			},
		});

		await db.adminActionLog.create({
			data: {
				adminId: session.profileId,
				action: "place_created",
				entityType: "place",
				entityId: place.id,
				afterValue: {
					name: place.name,
					address: place.address,
					latitude: place.latitude,
					longitude: place.longitude,
				} as object,
			},
		});

		return NextResponse.json({ place: serializePlace(place) });
	} catch (error) {
		return placesErrorResponse(
			error,
			"[places create]",
			"Failed to create place.",
		);
	}
}
