import { db, listCustomerProfiles } from "@rotra/db";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import {
	customerProfileErrorResponse,
	parsePositiveInt,
} from "./route-helpers";

export const runtime = "nodejs";

function serializeRow(row: {
	id: string;
	name: string;
	email: string | null;
	avatarUrl: string | null;
	isVerified: boolean;
	mmr: number;
	createdAt: Date;
}) {
	return {
		...row,
		createdAt: row.createdAt.toISOString(),
	};
}

export async function GET(req: Request) {
	try {
		await requireAdminSession();
		const { searchParams } = new URL(req.url);
		const q = searchParams.get("q")?.trim() || undefined;
		const page = parsePositiveInt(searchParams.get("page"), 1);
		const limit = parsePositiveInt(searchParams.get("limit"), 25);

		const result = await listCustomerProfiles(db, {
			search: q,
			page,
			limit,
		});

		return NextResponse.json({
			...result,
			rows: result.rows.map(serializeRow),
		});
	} catch (error) {
		return customerProfileErrorResponse(error, "[customers list]");
	}
}
