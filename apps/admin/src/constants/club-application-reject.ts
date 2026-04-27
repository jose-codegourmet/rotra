export const APPLICATION_REJECTION_REASONS = [
	"insufficient_information",
	"unverifiable_venue",
	"unverifiable_contact",
	"duplicate_or_squatting",
	"policy_violation",
	"spam_or_low_quality",
	"applicant_history",
	"other",
] as const;

export type ApplicationRejectionReasonCode =
	(typeof APPLICATION_REJECTION_REASONS)[number];

const REASON_LABELS: Record<ApplicationRejectionReasonCode, string> = {
	insufficient_information: "Insufficient information",
	unverifiable_venue: "Unverifiable venue",
	unverifiable_contact: "Unverifiable contact",
	duplicate_or_squatting: "Duplicate or squatting",
	policy_violation: "Policy violation",
	spam_or_low_quality: "Spam or low quality",
	applicant_history: "Applicant history",
	other: "Other",
};

export function applicationRejectionReasonLabel(
	code: ApplicationRejectionReasonCode | string,
): string {
	if (code in REASON_LABELS) {
		return REASON_LABELS[code as ApplicationRejectionReasonCode];
	}
	return code.replaceAll("_", " ");
}

export const CLUB_APPLICATION_REJECT_NOTE_MAX = 2000;
