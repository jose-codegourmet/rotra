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

export type PatchCustomerIdentityBody = {
	name: string;
	email: string | null;
	phone: string | null;
};

export async function patchCustomerIdentity(
	profileId: string,
	body: PatchCustomerIdentityBody,
): Promise<void> {
	const res = await fetch(
		`/api/customers/${encodeURIComponent(profileId)}/identity`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		},
	);
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to update basic information."),
		);
	}
}

export type PatchCustomerSkillsBody = {
	playingLevel: string | null;
	formatPreference: string | null;
	courtPosition: string | null;
	playMode: string | null;
};

export async function patchCustomerSkills(
	profileId: string,
	body: PatchCustomerSkillsBody,
): Promise<void> {
	const res = await fetch(
		`/api/customers/${encodeURIComponent(profileId)}/skills`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		},
	);
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to update skills and preferences."),
		);
	}
}

export async function postCustomerTag(
	profileId: string,
	slug: string,
): Promise<void> {
	const res = await fetch(
		`/api/customers/${encodeURIComponent(profileId)}/tags`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ slug }),
		},
	);
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to add tag."));
	}
}

export async function deleteCustomerTag(
	profileId: string,
	tagId: string,
): Promise<void> {
	const res = await fetch(
		`/api/customers/${encodeURIComponent(profileId)}/tags/${encodeURIComponent(tagId)}`,
		{ method: "DELETE" },
	);
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to remove tag."));
	}
}
