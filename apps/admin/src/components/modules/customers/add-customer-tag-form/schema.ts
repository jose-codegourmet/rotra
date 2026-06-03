import { z } from "zod";

export const addCustomerTagFormSchema = z.object({
	slug: z.string().min(1).max(80),
});

export type AddCustomerTagFormValues = z.infer<typeof addCustomerTagFormSchema>;
