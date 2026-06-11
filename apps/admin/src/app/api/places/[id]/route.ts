import { db } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { PlaceRow } from "@/hooks/usePlaces/server";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const patchPlaceBodySchema = z.object({
	name: z.string().min(2).max(120).optional(),
	address: z.string().min(5).optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	description: z.string().max(500).optional().nullable(),
	phone: z.string().max(30).optional().nullable(),
	website: z.union([z.string().url(), z.literal("")]).optional().nullable(),
	status: z.enum(["confirmed"]).optional(),
});

function serializePlace(place: {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	description: string | null;
	phone: string | null;
	website: string | null;
	status: PlaceRow["status"];
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

const placeInclude = {
	submittedBy: { select: { id: true, name: true } },
	reviewedBy: { select: { id: true, name: true } },
} as const;

export async function PATCH(
	req: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = patchPlaceBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();

		const before = await db.place.findUnique({
			where: { id },
			include: placeInclude,
		});

		if (!before) {
			return NextResponse.json(
				{ error: "Place not found.", code: "not_found" },
				{ status: 404 },
			);
		}

		const isConfirmOnly =
			parsed.data.status === "confirmed" &&
			Object.keys(parsed.data).length === 1;

		const isConfirming =
			parsed.data.status === "confirmed" && before.status === "unreviewed";

		const place = await db.place.update({
			where: { id },
			data: {
				...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
				...(parsed.data.address !== undefined
					? { address: parsed.data.address }
					: {}),
				...(parsed.data.latitude !== undefined
					? { latitude: parsed.data.latitude }
					: {}),
				...(parsed.data.longitude !== undefined
					? { longitude: parsed.data.longitude }
					: {}),
				...(parsed.data.description !== undefined
					? { description: parsed.data.description }
					: {}),
				...(parsed.data.phone !== undefined
					? { phone: parsed.data.phone }
					: {}),
				...(parsed.data.website !== undefined
					? { website: parsed.data.website }
					: {}),
				...(isConfirming
					? {
							status: "confirmed",
							reviewedById: session.profileId,
							reviewedAt: new Date(),
						}
					: {}),
			},
			include: placeInclude,
		});

		if (isConfirmOnly && isConfirming) {
			await db.adminActionLog.create({
				data: {
					adminId: session.profileId,
					action: "place_confirmed",
					entityType: "place",
					entityId: place.id,
					beforeValue: { status: "unreviewed" } as object,
					afterValue: { status: "confirmed" } as object,
				},
			});
		} else {
			await db.adminActionLog.create({
				data: {
					adminId: session.profileId,
					action: "place_updated",
					entityType: "place",
					entityId: place.id,
					beforeValue: {
						name: before.name,
						address: before.address,
						latitude: before.latitude,
						longitude: before.longitude,
						description: before.description,
						phone: before.phone,
						website: before.website,
					} as object,
					afterValue: {
						name: place.name,
						address: place.address,
						latitude: place.latitude,
						longitude: place.longitude,
						description: place.description,
						phone: place.phone,
						website: place.website,
					} as object,
				},
			});
		}

		return NextResponse.json({ place: serializePlace(place) });
	} catch (error) {
		return placesErrorResponse(
			error,
			"[places patch]",
			"Failed to update place.",
		);
	}
}

export async function DELETE(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		const session = await requireAdminSession();

		const before = await db.place.findUnique({ where: { id } });

		if (!before) {
			return NextResponse.json(
				{ error: "Place not found.", code: "not_found" },
				{ status: 404 },
			);
		}

		await db.adminActionLog.create({
			data: {
				adminId: session.profileId,
				action: "place_deleted",
				entityType: "place",
				entityId: before.id,
				beforeValue: {
					name: before.name,
					status: before.status,
				} as object,
			},
		});

		await db.place.delete({ where: { id } });

		return NextResponse.json({ ok: true });
	} catch (error) {
		return placesErrorResponse(
			error,
			"[places delete]",
			"Failed to delete place.",
		);
	}
}
