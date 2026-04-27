import type { ClubApplicationDto } from "./club-application-shared";

/** Row in the admin approvals table (application + applicant). */
export type ClubApplicationListRowDto = ClubApplicationDto & {
	applicantName: string;
	applicantEmail: string | null;
};
