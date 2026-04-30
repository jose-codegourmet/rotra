import { z } from "zod";

export const loginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address.")
		.email("Enter a valid email address."),
	password: z
		.string()
		.trim()
		.min(1, "Enter your password.")
		.min(8, "Password must be at least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
