import { handleClientAdminGate } from "@/lib/auth/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
	return handleClientAdminGate(request);
}
