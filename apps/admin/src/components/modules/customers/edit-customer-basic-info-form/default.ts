import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import type { EditCustomerBasicInfoFormValues } from "./schema";

export function buildEditCustomerBasicInfoFormDefaults(
	profile: CustomerProfileSerialized,
): EditCustomerBasicInfoFormValues {
	return {
		name: profile.name,
		email: profile.email ?? "",
		phone: profile.phone ?? "",
	};
}
