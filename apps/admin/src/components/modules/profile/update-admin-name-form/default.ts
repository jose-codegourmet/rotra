import type { UpdateAdminNameFormValues } from "./schema";

export function buildUpdateAdminNameFormDefaults(
	name: string,
): UpdateAdminNameFormValues {
	return { name };
}
