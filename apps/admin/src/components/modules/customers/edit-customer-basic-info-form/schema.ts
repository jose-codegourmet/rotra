import { z } from "zod";

export const editCustomerBasicInfoFormSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().refine(
		(s) => {
			const t = s.trim();
			return t.length === 0 || z.string().email().safeParse(t).success;
		},
		{ message: "Invalid email" },
	),
	phone: z.string().refine((s) => s.trim().length <= 40, {
		message: "Phone must be at most 40 characters",
	}),
});

export type EditCustomerBasicInfoFormValues = z.infer<
	typeof editCustomerBasicInfoFormSchema
>;
