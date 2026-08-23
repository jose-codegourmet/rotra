import { MOCK_SESSION_SETUP_VALUES } from "@/constants/mock-session-setup";

import type { SessionSetupFormValues } from "./schema";

export function defaultSessionSetupValues(): SessionSetupFormValues {
	return { ...MOCK_SESSION_SETUP_VALUES };
}
