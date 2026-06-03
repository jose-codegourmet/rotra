import { db, getOwnAdminProfile, updateOwnAdminName } from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { adminUserErrorResponse } from "../route-helpers";

export const runtime = "nodejs";

const patchOwnProfileSchema = z.object({
	name: z.string().trim().min(1, "Name is required."),
});

export async function GET() {
	try {
		const session = await requireAdminSession();
		const profile = await getOwnAdminProfile(db, session.profileId);
		return NextResponse.json({ profile });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users me GET]");
	}
}

export async function PATCH(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body.", code: "bad_input" },
			{ status: 400 },
		);
	}

	const parsed = patchOwnProfileSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{
				error: parsed.error.issues[0]?.message ?? "Invalid request body.",
				code: "bad_input",
			},
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		const { name } = await updateOwnAdminName(db, {
			profileId: session.profileId,
			name: parsed.data.name,
		});
		return NextResponse.json({ ok: true, profile: { name } });
	} catch (error) {
		return adminUserErrorResponse(error, "[admin-users me PATCH]");
	}
}
