import { db, Prisma } from "@rotra/db";
import { NextResponse } from "next/server";

import {
	isValidWaitlistEmail,
	normalizeWaitlistEmail,
} from "@/lib/waitlist/validate-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request." }, { status: 400 });
	}

	const emailRaw =
		body &&
		typeof body === "object" &&
		"email" in body &&
		typeof (body as { email: unknown }).email === "string"
			? (body as { email: string }).email
			: null;

	if (!emailRaw || !isValidWaitlistEmail(emailRaw)) {
		return NextResponse.json(
			{ error: "Check your email address." },
			{ status: 400 },
		);
	}

	const email = normalizeWaitlistEmail(emailRaw);

	try {
		await db.waitlistSignup.create({
			data: { email },
		});
		return NextResponse.json({ ok: true });
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2002"
		) {
			return NextResponse.json({ ok: true });
		}
		console.error("[waitlist]", e);
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 },
		);
	}
}
