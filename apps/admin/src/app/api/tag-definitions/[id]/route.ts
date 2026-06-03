import {
	db,
	getTagDefinitionById,
	type TagAssignableBy,
	updateTagDefinition,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	notifyTagDefinitionChanged,
	testerErrorResponse,
} from "../../testers/route-helpers";

export const runtime = "nodejs";

const patchTagBodySchema = z.object({
	label: z.string().min(1).max(120).optional(),
	description: z.string().max(500).optional().nullable(),
	assignableBy: z.enum(["any_admin", "super_admin_only"]).optional(),
	isActive: z.boolean().optional(),
});

function parseAssignableBy(value: string): TagAssignableBy | null {
	return value === "any_admin" || value === "super_admin_only" ? value : null;
}

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	try {
		await requireAdminSession();
		const definition = await getTagDefinitionById(db, id);
		if (!definition) {
			return NextResponse.json(
				{ error: "Tag definition not found.", code: "not_found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			definition: {
				...definition,
				createdAt: definition.createdAt.toISOString(),
				updatedAt: definition.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		return testerErrorResponse(error, "[tag-definitions detail GET]");
	}
}

export async function PATCH(
	request: Request,
	context: { params: Promise<{ id: string }> },
) {
	const { id } = await context.params;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = patchTagBodySchema.safeParse(body);
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
				{ error: "Only Super Admins can update tag definitions." },
				{ status: 403 },
			);
		}

		const before = await getTagDefinitionById(db, id);
		if (!before) {
			return NextResponse.json(
				{ error: "Tag definition not found.", code: "not_found" },
				{ status: 404 },
			);
		}

		let assignableBy: TagAssignableBy | undefined;
		if (parsed.data.assignableBy !== undefined) {
			const parsedRole = parseAssignableBy(parsed.data.assignableBy);
			if (!parsedRole) {
				return NextResponse.json(
					{ error: "Invalid assignableBy value." },
					{ status: 400 },
				);
			}
			assignableBy = parsedRole;
		}

		const definition = await updateTagDefinition(db, {
			id,
			...(parsed.data.label !== undefined ? { label: parsed.data.label } : {}),
			...(parsed.data.description !== undefined
				? { description: parsed.data.description }
				: {}),
			...(assignableBy !== undefined ? { assignableBy } : {}),
			...(parsed.data.isActive !== undefined
				? { isActive: parsed.data.isActive }
				: {}),
		});

		const action =
			parsed.data.isActive === false
				? "tag_definition_deactivated"
				: "tag_definition_updated";

		await db.adminActionLog.create({
			data: {
				adminId: session.profileId,
				action,
				entityType: "tag_definition",
				entityId: definition.id,
				beforeValue: {
					slug: before.slug,
					label: before.label,
					isActive: before.isActive,
				} as object,
				afterValue: {
					slug: definition.slug,
					label: definition.label,
					isActive: definition.isActive,
				} as object,
			},
		});

		await notifyTagDefinitionChanged({
			actorProfileId: session.profileId,
			title:
				action === "tag_definition_deactivated"
					? "Tag definition deactivated"
					: "Tag definition updated",
			body: `Tag "${definition.label}" (${definition.slug}) was updated.`,
		});

		return NextResponse.json({
			definition: {
				...definition,
				createdAt: definition.createdAt.toISOString(),
				updatedAt: definition.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		return testerErrorResponse(error, "[tag-definitions PATCH]");
	}
}
