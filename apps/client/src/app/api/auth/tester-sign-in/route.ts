import {
	db,
	markTesterInvitationAccepted,
	validateTesterSession,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const bodySchema = z.object({
	email: z.string().email(),
	testerPassword: z.string().min(1),
});

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body." },
			{ status: 400 },
		);
	}

	const parsed = bodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Enter a valid email and password." },
			{ status: 400 },
		);
	}

	const email = parsed.data.email.trim().toLowerCase();
	const password = parsed.data.testerPassword;

	try {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error || !data.user?.id) {
			return NextResponse.json(
				{ error: "Incorrect email or password." },
				{ status: 401 },
			);
		}

		const isTester = await validateTesterSession(db, {
			profileId: data.user.id,
		});

		if (!isTester) {
			await supabase.auth.signOut();
			return NextResponse.json(
				{
					error: "Not a tester account.",
					code: "NOT_TESTER",
				},
				{ status: 403 },
			);
		}

		await markTesterInvitationAccepted(db, data.user.id);

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("[tester-sign-in]", err);
		return NextResponse.json(
			{ error: "Unable to sign in right now." },
			{ status: 500 },
		);
	}
}
