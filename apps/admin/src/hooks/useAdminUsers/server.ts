import type {
	AdminActor,
	AdminUserRow,
} from "@/components/modules/users/users.types";

export type ListAdminUsersResponse = {
	users: AdminUserRow[];
	actor: AdminActor;
};

type ApiError = {
	error?: string;
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

export async function fetchAdminUsers(): Promise<ListAdminUsersResponse> {
	const response = await fetch("/api/admin-users", { method: "GET" });
	const payload = (await response.json().catch(() => null)) as unknown;

	if (!response.ok) {
		throw new Error(
			parseApiErrorMessage(payload, "Failed to load admin users."),
		);
	}

	if (
		typeof payload !== "object" ||
		!payload ||
		!("users" in payload) ||
		!("actor" in payload)
	) {
		throw new Error("Invalid admin users response.");
	}

	return payload as ListAdminUsersResponse;
}

export async function inviteAdminUserRequest(payload: {
	name: string;
	email: string;
	role: "admin" | "super_admin";
}): Promise<void> {
	const response = await fetch("/api/admin-users/invite", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const body = (await response.json().catch(() => null)) as ApiError | null;
	if (!response.ok) {
		throw new Error(body?.error ?? "Failed to send invite.");
	}
}

async function performAdminUserMutationRequest(input: {
	path: string;
	method: "POST" | "PATCH";
	body?: Record<string, string>;
	fallbackError: string;
}): Promise<void> {
	const response = await fetch(input.path, {
		method: input.method,
		headers: {
			"Content-Type": "application/json",
		},
		...(input.body ? { body: JSON.stringify(input.body) } : {}),
	});
	const payload = (await response.json().catch(() => null)) as unknown;
	if (!response.ok) {
		throw new Error(parseApiErrorMessage(payload, input.fallbackError));
	}
}

export async function resendAdminInviteRequest(userId: string): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/resend-invite`,
		method: "POST",
		fallbackError: "Failed to resend invite.",
	});
}

export async function deactivateAdminUserRequest(
	userId: string,
): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/deactivate`,
		method: "POST",
		fallbackError: "Failed to deactivate admin.",
	});
}

export async function reactivateAdminUserRequest(
	userId: string,
): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/reactivate`,
		method: "POST",
		fallbackError: "Failed to reactivate admin.",
	});
}

export async function promoteAdminToSuperAdminRequest(
	userId: string,
): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/role`,
		method: "PATCH",
		body: { role: "super_admin" },
		fallbackError: "Failed to promote admin.",
	});
}

export async function demoteSuperAdminToAdminRequest(
	userId: string,
): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/role`,
		method: "PATCH",
		body: { role: "admin" },
		fallbackError: "Failed to demote admin.",
	});
}

export async function forceSignOutAdminUserRequest(
	userId: string,
): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/force-signout`,
		method: "POST",
		fallbackError: "Failed to force sign-out.",
	});
}

export async function deleteAdminUserRequest(userId: string): Promise<void> {
	await performAdminUserMutationRequest({
		path: `/api/admin-users/${userId}/delete`,
		method: "POST",
		fallbackError: "Failed to delete admin.",
	});
}
