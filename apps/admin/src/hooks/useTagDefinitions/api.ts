import type { TagAssignableBy } from "@prisma/client";

export type TagDefinitionSerialized = {
	id: string;
	slug: string;
	label: string;
	description: string | null;
	isActive: boolean;
	assignableBy: TagAssignableBy;
	createdAt: string;
	updatedAt: string;
};

export type TagDefinitionsListResponse = {
	definitions: TagDefinitionSerialized[];
};

function parseApiErrorMessage(payload: unknown, fallback: string): string {
	if (
		typeof payload === "object" &&
		payload &&
		"error" in payload &&
		typeof payload.error === "string"
	) {
		return payload.error;
	}
	return fallback;
}

export async function fetchTagDefinitions(): Promise<TagDefinitionsListResponse> {
	const response = await fetch("/api/tag-definitions", { method: "GET" });
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to load tag definitions."),
		);
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("definitions" in payload) ||
		!Array.isArray((payload as { definitions: unknown }).definitions)
	) {
		throw new Error("Invalid tag definitions response.");
	}

	return payload as TagDefinitionsListResponse;
}

export type CreateTagDefinitionPayload = {
	slug: string;
	label: string;
	description?: string | null;
	assignableBy: TagAssignableBy;
};

export type UpdateTagDefinitionPayload = {
	label?: string;
	description?: string | null;
	assignableBy?: TagAssignableBy;
	isActive?: boolean;
};

export async function postTagDefinition(
	body: CreateTagDefinitionPayload,
): Promise<{ definition: TagDefinitionSerialized }> {
	const response = await fetch("/api/tag-definitions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to create tag definition."),
		);
	}
	return payload as { definition: TagDefinitionSerialized };
}

export async function patchTagDefinition(
	id: string,
	body: UpdateTagDefinitionPayload,
): Promise<{ definition: TagDefinitionSerialized }> {
	const response = await fetch(
		`/api/tag-definitions/${encodeURIComponent(id)}`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		},
	);
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to update tag definition."),
		);
	}
	return payload as { definition: TagDefinitionSerialized };
}
