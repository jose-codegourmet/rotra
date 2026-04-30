export type PasswordApiResponse = {
	ok: boolean;
	message: string;
	code?: string;
};

export class PasswordApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: string | undefined,
		message: string,
	) {
		super(message);
		this.name = "PasswordApiError";
	}
}

export async function signIn(payload: {
	email: string;
	password: string;
}): Promise<PasswordApiResponse> {
	const response = await fetch("/api/auth/sign-in", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const body = (await response
		.json()
		.catch(() => null)) as PasswordApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new PasswordApiError(
			response.status,
			body?.code,
			body?.message ?? "Unable to sign in right now.",
		);
	}
	return body;
}

export async function setPassword(
	password: string,
): Promise<PasswordApiResponse> {
	const response = await fetch("/api/auth/set-password", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ password }),
	});
	const body = (await response
		.json()
		.catch(() => null)) as PasswordApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new PasswordApiError(
			response.status,
			body?.code,
			body?.message ?? "Unable to set password right now.",
		);
	}
	return body;
}

export async function requestPasswordReset(
	email: string,
): Promise<PasswordApiResponse> {
	const response = await fetch("/api/auth/reset-password", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ email }),
	});
	const body = (await response
		.json()
		.catch(() => null)) as PasswordApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new PasswordApiError(
			response.status,
			body?.code,
			body?.message ?? "Unable to send password reset link right now.",
		);
	}
	return body;
}
