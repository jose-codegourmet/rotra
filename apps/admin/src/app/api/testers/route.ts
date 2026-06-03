import {
	createTesterProfile,
	db,
	listTesterProfiles,
	type TesterAuthAdmin,
	type TesterDirectoryStatus,
} from "@rotra/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { getClientAppOrigin } from "@/lib/client-app-url";
import {
	deleteAdminAuthUser,
	inviteTesterAuthUser,
} from "@/lib/supabase/admin";
import { parsePositiveInt, testerErrorResponse } from "./route-helpers";

export const runtime = "nodejs";

const createTesterBodySchema = z.object({
	email: z.string().email().max(320),
	name: z.string().min(1).max(120),
});

function buildTesterAuthAdmin(): TesterAuthAdmin {
	return {
		inviteUserByEmail: async (email, options) => {
			const { userId } = await inviteTesterAuthUser({
				email,
				name: String(options.data.name ?? ""),
				testerPassword: String(options.data.tester_password ?? ""),
				redirectTo: options.redirectTo,
			});
			return { userId };
		},
		deleteUser: deleteAdminAuthUser,
	};
}

function parseTesterStatus(
	value: string | null,
): TesterDirectoryStatus | undefined {
	if (
		value === "pending" ||
		value === "active" ||
		value === "revoked" ||
		value === "expired"
	) {
		return value;
	}
	return undefined;
}

export async function GET(req: Request) {
	try {
		await requireAdminSession();
		const { searchParams } = new URL(req.url);
		const page = parsePositiveInt(searchParams.get("page"), 1);
		const limit = parsePositiveInt(searchParams.get("limit"), 25);
		const status = parseTesterStatus(searchParams.get("status"));

		const result = await listTesterProfiles(db, {
			page,
			limit,
			...(status !== undefined ? { status } : {}),
		});

		return NextResponse.json({
			...result,
			rows: result.rows.map((row) => ({
				...row,
				invitedAt: row.invitedAt.toISOString(),
			})),
		});
	} catch (error) {
		return testerErrorResponse(error, "[testers GET]");
	}
}

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const parsed = createTesterBodySchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid body.", issues: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	try {
		const session = await requireAdminSession();
		const clientAppOrigin = getClientAppOrigin();
		if (!clientAppOrigin) {
			return NextResponse.json(
				{ error: "NEXT_PUBLIC_CLIENT_APP_ORIGIN is not configured." },
				{ status: 503 },
			);
		}

		const result = await createTesterProfile(db, buildTesterAuthAdmin(), {
			actorProfileId: session.profileId,
			email: parsed.data.email,
			name: parsed.data.name,
			clientAppOrigin,
		});

		return NextResponse.json({
			ok: true,
			profileId: result.profileId,
			invitationId: result.invitationId,
		});
	} catch (error) {
		return testerErrorResponse(error, "[testers POST]");
	}
}
