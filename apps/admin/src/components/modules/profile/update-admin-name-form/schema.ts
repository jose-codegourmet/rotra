import { z } from "zod";

export const updateAdminNameFormSchema = z.object({
	name: z.string().trim().min(1, "Name is required."),
});

export type UpdateAdminNameFormValues = z.infer<
	typeof updateAdminNameFormSchema
>;
