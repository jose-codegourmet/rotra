import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import type { EditCustomerSkillsFormValues } from "./schema";

export function buildEditCustomerSkillsFormDefaults(
	profile: CustomerProfileSerialized,
): EditCustomerSkillsFormValues {
	return {
		playingLevel: profile.playingLevel ?? "",
		formatPreference: profile.formatPreference ?? "",
		courtPosition: profile.courtPosition ?? "",
		playMode: profile.playMode ?? "",
	};
}
