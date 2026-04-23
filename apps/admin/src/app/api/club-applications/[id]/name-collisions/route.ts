import { db } from "@rotra/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export type ClubNameCollisionRow = {
	id: string;
	name: string;
	locationCity: string | null;
	status: string;
	ownerName: string | null;
	createdAt: string;
};

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		const application = await db.clubApplication.findUnique({
			where: { id },
			select: { clubName: true },
		});
		if (!application) {
			return NextResponse.json({ error: "Not found." }, { status: 404 });
		}

		const clubs = await db.club.findMany({
			where: {
				name: { equals: application.clubName, mode: "insensitive" },
			},
			select: {
				id: true,
				name: true,
				locationCity: true,
				status: true,
				createdAt: true,
				owner: { select: { name: true } },
			},
			orderBy: { createdAt: "desc" },
			take: 50,
		});

		const payload: { clubs: ClubNameCollisionRow[] } = {
			clubs: clubs.map((c) => ({
				id: c.id,
				name: c.name,
				locationCity: c.locationCity,
				status: c.status,
				ownerName: c.owner.name,
				createdAt: c.createdAt.toISOString(),
			})),
		};

		return NextResponse.json(payload);
	} catch (e) {
		console.error("[admin club-applications name-collisions GET]", e);
		return NextResponse.json(
			{ error: "Failed to load name collisions." },
			{ status: 500 },
		);
	}
}
