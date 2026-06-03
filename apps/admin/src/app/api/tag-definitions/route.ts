import {
	createTagDefinition,
	db,
	listTagDefinitions,
	type TagAssignableBy,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	notifyTagDefinitionChanged,
	testerErrorResponse,
} from "../testers/route-helpers";

export const runtime = "nodejs";

const createTagBodySchema = z.object({
	slug: z.string().min(1).max(80),
	label: z.string().min(1).max(120),
	description: z.string().max(500).optional().nullable(),
	assignableBy: z.enum(["any_admin", "super_admin_only"]),
});

function parseAssignableBy(value: string): TagAssignableBy | null {
	return value === "any_admin" || value === "super_admin_only" ? value : null;
}

export async function GET() {
	try {
		const session = await requireAdminSession();
		const definitions = await listTagDefinitions(db, {
			includeInactive: session.adminRole === "super_admin",
		});

		return NextResponse.json({
			definitions: definitions.map((d) => ({
				...d,
				createdAt: d.createdAt.toISOString(),
				updatedAt: d.updatedAt.toISOString(),
			})),
		});
	} catch (error) {
		return testerErrorResponse(error, "[tag-definitions GET]");
	}
}

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = createTagBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		if (session.adminRole !== "super_admin") {
			return NextResponse.json(
				{ error: "Only Super Admins can create tag definitions." },
				{ status: 403 },
			);
		}

		const assignableBy = parseAssignableBy(parsed.data.assignableBy);
		if (!assignableBy) {
			return NextResponse.json(
				{ error: "Invalid assignableBy value." },
				{ status: 400 },
			);
		}

		const definition = await createTagDefinition(db, {
			slug: parsed.data.slug,
			label: parsed.data.label,
			...(parsed.data.description !== undefined
				? { description: parsed.data.description }
				: {}),
			assignableBy,
			createdById: session.profileId,
		});

		await db.adminActionLog.create({
			data: {
				adminId: session.profileId,
				action: "tag_definition_created",
				entityType: "tag_definition",
				entityId: definition.id,
				afterValue: {
					slug: definition.slug,
					label: definition.label,
				} as object,
			},
		});

		await notifyTagDefinitionChanged({
			actorProfileId: session.profileId,
			title: "Tag definition created",
			body: `Tag "${definition.label}" (${definition.slug}) was created.`,
		});

		return NextResponse.json({
			definition: {
				...definition,
				createdAt: definition.createdAt.toISOString(),
				updatedAt: definition.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		return testerErrorResponse(error, "[tag-definitions POST]");
	}
}
