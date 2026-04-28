import { z } from "zod";

export const loginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address.")
		.email("Enter a valid email address."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
