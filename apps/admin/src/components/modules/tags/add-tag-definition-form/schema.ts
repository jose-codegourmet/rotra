import { z } from "zod";

export const addTagDefinitionFormSchema = z.object({
	slug: z.string().min(1).max(80),
	label: z.string().min(1).max(120),
	description: z.string().max(500).optional(),
	assignableBy: z.enum(["any_admin", "super_admin_only"]),
});

export type AddTagDefinitionFormValues = z.infer<
	typeof addTagDefinitionFormSchema
>;
