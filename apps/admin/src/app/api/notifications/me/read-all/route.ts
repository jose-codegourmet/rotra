import { db, markAllAdminNotificationsRead } from "@rotra/db";
import { NextResponse } from "next/server";

import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function POST() {
	try {
		const session = await requireAdminSession();
		const { count } = await markAllAdminNotificationsRead(db, {
			adminId: session.profileId,
		});

		return NextResponse.json({ ok: true, count });
	} catch (error) {
		if (error instanceof AdminSessionError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}
		console.error("[notifications me read-all POST]", error);
		return NextResponse.json(
			{ error: "Failed to mark notifications as read." },
			{ status: 500 },
		);
	}
}
