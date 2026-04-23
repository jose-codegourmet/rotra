import { z } from "zod";

import {
	APPLICATION_REJECTION_REASONS,
	CLUB_APPLICATION_REJECT_NOTE_MAX,
} from "@/constants/club-application-reject";

export const rejectReasonFormSchema = z.object({
	reason: z.enum(APPLICATION_REJECTION_REASONS, {
		required_error: "Select a rejection reason.",
		invalid_type_error: "Select a rejection reason.",
	}),
	reviewNote: z
		.string()
		.trim()
		.max(CLUB_APPLICATION_REJECT_NOTE_MAX, {
			message: `Note must be at most ${CLUB_APPLICATION_REJECT_NOTE_MAX} characters.`,
		}),
});

export type RejectReasonFormValues = z.infer<typeof rejectReasonFormSchema>;

export type ClubApplicationRejectFormValues = RejectReasonFormValues;
