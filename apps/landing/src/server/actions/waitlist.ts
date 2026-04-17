"use server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistResult = { ok: true } | { ok: false; error: string };

/** Stub: validates email only. Wire to CRM or provider when ready. */
export async function submitWaitlistEmail(
	_prev: WaitlistResult | undefined,
	formData: FormData,
): Promise<WaitlistResult> {
	const raw = formData.get("email");
	if (typeof raw !== "string") {
		return { ok: false, error: "Check your email address." };
	}
	const email = raw.trim();
	if (!emailPattern.test(email)) {
		return { ok: false, error: "Check your email address." };
	}
	return { ok: true };
}
