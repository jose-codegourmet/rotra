import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

type Row = {
	id: string;
	playerId: string;
	clubName: string;
	description: string;
	intent: string;
	locationCity: string;
	locationVenue: string;
	venueAddress: string;
	facebookPageUrl: string | null;
	facebookProfileUrl: string | null;
	contactNumber: string | null;
	expectedPlayerCount: ClubApplicationListRowDto["expectedPlayerCount"];
	additionalNotes: string | null;
	status: ClubApplicationListRowDto["status"];
	rejectionReason: string | null;
	reviewNote: string | null;
	reviewedById: string | null;
	reviewedAt: Date | null;
	resultingClubId: string | null;
	createdAt: Date;
	updatedAt: Date;
	player: { name: string; email: string | null };
};

export function toClubApplicationListRowDto(row: Row): ClubApplicationListRowDto {
	return {
		id: row.id,
		playerId: row.playerId,
		clubName: row.clubName,
		description: row.description,
		intent: row.intent,
		locationCity: row.locationCity,
		locationVenue: row.locationVenue,
		venueAddress: row.venueAddress,
		facebookPageUrl: row.facebookPageUrl,
		facebookProfileUrl: row.facebookProfileUrl,
		contactNumber: row.contactNumber,
		expectedPlayerCount: row.expectedPlayerCount,
		additionalNotes: row.additionalNotes,
		status: row.status,
		rejectionReason: row.rejectionReason,
		reviewNote: row.reviewNote,
		reviewedById: row.reviewedById,
		reviewedAt: row.reviewedAt?.toISOString() ?? null,
		resultingClubId: row.resultingClubId,
		createdAt: row.createdAt.toISOString(),
		updatedAt: row.updatedAt.toISOString(),
		applicantName: row.player.name,
		applicantEmail: row.player.email,
	};
}
