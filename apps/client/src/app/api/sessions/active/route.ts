import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/server/current-profile";
import type { ActiveSessionResponse } from "@/types/session-discovery";

export const runtime = "nodejs";

export async function GET() {
	const profile = await getCurrentProfile();
	if (!profile) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const response: ActiveSessionResponse = { active: null };
	return NextResponse.json(response);
}
