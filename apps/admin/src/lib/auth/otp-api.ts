export type OtpApiResponse = {
	ok: boolean;
	message: string;
	code?: string;
};

export class OtpApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: string | undefined,
		message: string,
	) {
		super(message);
		this.name = "OtpApiError";
	}
}

export async function requestOtp(email: string): Promise<OtpApiResponse> {
	const response = await fetch("/api/auth/request-otp", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ email }),
	});
	const body = (await response
		.json()
		.catch(() => null)) as OtpApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new OtpApiError(
			response.status,
			body?.code,
			body?.message ?? "Unable to send one-time code.",
		);
	}
	return body;
}

export async function verifyOtp(payload: {
	email: string;
	token: string;
}): Promise<OtpApiResponse> {
	const response = await fetch("/api/auth/verify-otp", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const body = (await response
		.json()
		.catch(() => null)) as OtpApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new OtpApiError(
			response.status,
			body?.code,
			body?.message ?? "Invalid or expired one-time code.",
		);
	}
	return body;
}

export async function resendOtp(email: string): Promise<OtpApiResponse> {
	const response = await fetch("/api/auth/resend-otp", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({ email }),
	});
	const body = (await response
		.json()
		.catch(() => null)) as OtpApiResponse | null;
	if (!response.ok || !body?.ok) {
		throw new OtpApiError(
			response.status,
			body?.code,
			body?.message ?? "Unable to resend one-time code.",
		);
	}
	return body;
}
