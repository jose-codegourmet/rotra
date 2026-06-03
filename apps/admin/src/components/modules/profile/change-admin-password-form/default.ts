import type { ChangeAdminPasswordFormValues } from "./schema";

export function buildChangeAdminPasswordFormDefaults(): ChangeAdminPasswordFormValues {
	return {
		password: "",
		confirmPassword: "",
	};
}
