import type { RejectReasonFormValues } from "./schema";

export function emptyRejectReasonForm(): RejectReasonFormValues {
	return {
		reason: "insufficient_information",
		reviewNote: "",
	};
}
