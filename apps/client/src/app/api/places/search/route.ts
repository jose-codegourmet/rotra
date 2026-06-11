import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/server/current-profile";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
	const profile = await getCurrentProfile();
	if (!profile) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
	if (q.length < 2) {
		return NextResponse.json({ places: [] });
	}

	let supabase: Awaited<ReturnType<typeof createClient>>;
	try {
		supabase = await createClient();
	} catch {
		return NextResponse.json({ places: [] });
	}

	const { data, error } = await supabase
		.from("places")
		.select("id, name, address, latitude, longitude")
		.or(`name.ilike.%${q}%,address.ilike.%${q}%`)
		.eq("status", "confirmed")
		.order("name")
		.limit(6);

	if (error) {
		return NextResponse.json({ places: [] });
	}

	return NextResponse.json({ places: data });
}
