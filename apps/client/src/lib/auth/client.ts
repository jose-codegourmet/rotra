export type ClientAdminAuthResponse = {
	ok: boolean;
	message: string;
	code?: string;
	redirectTo?: string;
};

export class ClientAdminAuthError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: string | undefined,
		message: string,
	) {
		super(message);
		this.name = "ClientAdminAuthError";
	}
}

export async function unlockClientAdminGate(password: string): Promise<void> {
	const response = await fetch("/api/auth/admin-gate", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ password }),
	});

	const body = (await response
		.json()
		.catch(() => null)) as ClientAdminAuthResponse | null;
	if (!response.ok || !body?.ok) {
		throw new ClientAdminAuthError(
			response.status,
			body?.code,
			body?.message ?? "Unable to verify access password.",
		);
	}
}

export async function signInClientAdmin(input: {
	email: string;
	password: string;
}): Promise<string> {
	const response = await fetch("/api/auth/admin-sign-in", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(input),
	});

	const body = (await response
		.json()
		.catch(() => null)) as ClientAdminAuthResponse | null;
	if (!response.ok || !body?.ok) {
		throw new ClientAdminAuthError(
			response.status,
			body?.code,
			body?.message ?? "Unable to sign in right now.",
		);
	}

	return body.redirectTo ?? "/dashboard";
}
