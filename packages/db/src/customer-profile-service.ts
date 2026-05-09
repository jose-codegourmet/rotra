import type { FormatPreference, PlayingLevel, PlayMode, CourtPosition } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

export class CustomerProfileError extends Error {
	constructor(
		public readonly code: "not_found",
		message: string,
	) {
		super(message);
		this.name = "CustomerProfileError";
	}
}

export type CustomerDirectoryRow = {
	id: string;
	name: string;
	email: string | null;
	avatarUrl: string | null;
	isVerified: boolean;
	mmr: number;
	createdAt: Date;
};

export type CustomerProfileDetail = {
	id: string;
	name: string;
	email: string | null;
	avatarUrl: string | null;
	isVerified: boolean;
	mmr: number;
	mmrMatchesPlayed: number;
	playingLevel: PlayingLevel | null;
	formatPreference: FormatPreference | null;
	courtPosition: CourtPosition | null;
	playMode: PlayMode | null;
	onboardingCompleted: boolean;
	expTotal: number;
	createdAt: Date;
	updatedAt: Date;
};

export type ListCustomerProfilesInput = {
	search?: string | undefined;
	page?: number | undefined;
	limit?: number | undefined;
};

export type ListCustomerProfilesResult = {
	rows: CustomerDirectoryRow[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 50;

export async function listCustomerProfiles(
	db: PrismaClient,
	input: ListCustomerProfilesInput = {},
): Promise<ListCustomerProfilesResult> {
	const rawPage = input.page ?? 1;
	const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
	const rawLimit = input.limit ?? DEFAULT_PAGE_SIZE;
	const pageSize =
		Number.isFinite(rawLimit) && rawLimit >= 1
			? Math.min(Math.floor(rawLimit), MAX_PAGE_SIZE)
			: DEFAULT_PAGE_SIZE;
	const skip = (page - 1) * pageSize;

	const q = input.search?.trim();
	const searchFilter =
		q && q.length > 0
			? {
					OR: [
						{ name: { contains: q, mode: "insensitive" as const } },
						{ email: { contains: q, mode: "insensitive" as const } },
					],
				}
			: {};

	const where = {
		adminRole: null as null,
		...searchFilter,
	};

	const [total, rowsRaw] = await Promise.all([
		db.profile.count({ where }),
		db.profile.findMany({
			where,
			select: {
				id: true,
				name: true,
				email: true,
				avatarUrl: true,
				isVerified: true,
				mmr: true,
				createdAt: true,
			},
			orderBy: [{ name: "asc" }, { id: "asc" }],
			skip,
			take: pageSize,
		}),
	]);

	const rows: CustomerDirectoryRow[] = rowsRaw.map((p) => ({
		id: p.id,
		name: p.name,
		email: p.email,
		avatarUrl: p.avatarUrl,
		isVerified: p.isVerified,
		mmr: p.mmr,
		createdAt: p.createdAt,
	}));

	return {
		rows,
		page,
		pageSize,
		total,
		hasMore: skip + rows.length < total,
	};
}

export async function getCustomerProfileDetail(
	db: PrismaClient,
	id: string,
): Promise<CustomerProfileDetail> {
	const profile = await db.profile.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			email: true,
			avatarUrl: true,
			isVerified: true,
			mmr: true,
			mmrMatchesPlayed: true,
			playingLevel: true,
			formatPreference: true,
			courtPosition: true,
			playMode: true,
			onboardingCompleted: true,
			expTotal: true,
			createdAt: true,
			updatedAt: true,
			adminRole: true,
		},
	});

	if (!profile || profile.adminRole != null) {
		throw new CustomerProfileError("not_found", "Customer profile not found.");
	}

	return {
		id: profile.id,
		name: profile.name,
		email: profile.email,
		avatarUrl: profile.avatarUrl,
		isVerified: profile.isVerified,
		mmr: profile.mmr,
		mmrMatchesPlayed: profile.mmrMatchesPlayed,
		playingLevel: profile.playingLevel,
		formatPreference: profile.formatPreference,
		courtPosition: profile.courtPosition,
		playMode: profile.playMode,
		onboardingCompleted: profile.onboardingCompleted,
		expTotal: profile.expTotal,
		createdAt: profile.createdAt,
		updatedAt: profile.updatedAt,
	};
}
