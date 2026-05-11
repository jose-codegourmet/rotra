import { z } from "zod";

export const addCustomerTagFormSchema = z.object({
	label: z.string().min(1).max(60),
});

export type AddCustomerTagFormValues = z.infer<typeof addCustomerTagFormSchema>;
