import { db, listTagDefinitions, type TagDefinitionDto } from "@rotra/db";

import type { TagDefinitionsListResponse } from "./api";

export type {
	TagDefinitionSerialized,
	TagDefinitionsListResponse,
} from "./api";

export function serializeTagDefinitions(
	definitions: TagDefinitionDto[],
): TagDefinitionsListResponse {
	return {
		definitions: definitions.map((d) => ({
			...d,
			createdAt: d.createdAt.toISOString(),
			updatedAt: d.updatedAt.toISOString(),
		})),
	};
}

export async function fetchTagDefinitionsForPage(
	isSuperAdmin: boolean,
): Promise<TagDefinitionsListResponse> {
	const definitions = await listTagDefinitions(db, {
		includeInactive: isSuperAdmin,
	});
	return serializeTagDefinitions(definitions);
}
