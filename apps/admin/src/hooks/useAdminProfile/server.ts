import type { AdminRole } from "@prisma/client";

function parseApiErrorMessage(payload: unknown, fallback: string): string {
	if (
		typeof payload === "object" &&
		payload &&
		"error" in payload &&
		typeof payload.error === "string"
	) {
		return payload.error;
	}
	if (
		typeof payload === "object" &&
		payload &&
		"message" in payload &&
		typeof payload.message === "string"
	) {
		return payload.message;
	}
	return fallback;
}

export type AdminProfileSerialized = {
	id: string;
	name: string;
	email: string;
	adminRole: AdminRole;
};

export async function fetchAdminProfile(): Promise<AdminProfileSerialized> {
	const res = await fetch("/api/admin-users/me");
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to load profile."));
	}
	if (
		typeof payload === "object" &&
		payload &&
		"profile" in payload &&
		typeof payload.profile === "object" &&
		payload.profile
	) {
		return payload.profile as AdminProfileSerialized;
	}
	throw new Error("Failed to load profile.");
}

export async function patchAdminName(name: string): Promise<{ name: string }> {
	const res = await fetch("/api/admin-users/me", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name }),
	});
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to update name."));
	}
	if (
		typeof payload === "object" &&
		payload &&
		"profile" in payload &&
		typeof payload.profile === "object" &&
		payload.profile &&
		"name" in payload.profile &&
		typeof payload.profile.name === "string"
	) {
		return { name: payload.profile.name };
	}
	throw new Error("Failed to update name.");
}

export async function postChangePassword(password: string): Promise<void> {
	const res = await fetch("/api/admin-users/me/change-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ password }),
	});
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to change password."),
		);
	}
}

export async function deleteAdminAccount(): Promise<void> {
	const res = await fetch("/api/admin-users/me/delete", {
		method: "DELETE",
	});
	const payload = (await res.json().catch(() => null)) as unknown;
	if (!res.ok) {
		throw new Error(parseApiErrorMessage(payload, "Failed to delete account."));
	}
}
