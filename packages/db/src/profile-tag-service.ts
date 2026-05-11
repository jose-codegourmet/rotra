import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

export class ProfileTagError extends Error {
	constructor(
		public readonly code: "not_found" | "conflict" | "invalid_label",
		message: string,
	) {
		super(message);
		this.name = "ProfileTagError";
	}
}

export type ProfileTagDto = {
	id: string;
	slug: string;
	label: string;
	assignedAt: Date;
};

/**
 * Derives a stable slug from a display label: trim, lowercase, spaces → hyphens.
 * Example: "beta tester - scheduling" → "beta-tester---scheduling"
 */
export function slugifyTag(label: string): string {
	const slug = label.trim().toLowerCase().replace(/\s/g, "-");
	if (slug.length === 0) {
		throw new ProfileTagError("invalid_label", "Tag label cannot be empty.");
	}
	return slug;
}

export async function addProfileTag(
	db: PrismaClient,
	input: {
		profileId: string;
		label: string;
		assignedBy: string | null;
	},
): Promise<ProfileTagDto> {
	const trimmed = input.label.trim();
	if (trimmed.length === 0) {
		throw new ProfileTagError("invalid_label", "Tag label cannot be empty.");
	}

	let slug: string;
	try {
		slug = slugifyTag(trimmed);
	} catch (e) {
		if (e instanceof ProfileTagError) throw e;
		throw e;
	}

	const profile = await db.profile.findUnique({
		where: { id: input.profileId },
		select: { id: true, adminRole: true },
	});
	if (!profile || profile.adminRole != null) {
		throw new ProfileTagError("not_found", "Customer profile not found.");
	}

	try {
		const row = await db.profileTag.create({
			data: {
				profileId: input.profileId,
				slug,
				label: trimmed,
				assignedBy: input.assignedBy,
			},
			select: {
				id: true,
				slug: true,
				label: true,
				assignedAt: true,
			},
		});
		return row;
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
			throw new ProfileTagError(
				"conflict",
				"A tag with this slug already exists for this player.",
			);
		}
		throw e;
	}
}

export async function removeProfileTag(
	db: PrismaClient,
	input: { profileId: string; tagId: string },
): Promise<void> {
	const profile = await db.profile.findUnique({
		where: { id: input.profileId },
		select: { id: true, adminRole: true },
	});
	if (!profile || profile.adminRole != null) {
		throw new ProfileTagError("not_found", "Customer profile not found.");
	}

	const result = await db.profileTag.deleteMany({
		where: {
			id: input.tagId,
			profileId: input.profileId,
		},
	});
	if (result.count === 0) {
		throw new ProfileTagError("not_found", "Tag not found.");
	}
}
