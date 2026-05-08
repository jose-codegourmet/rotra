import { z } from "zod";

export const adminGateSchema = z.object({
	password: z.string().trim().min(1, "Enter the access password."),
});

export type AdminGateValues = z.infer<typeof adminGateSchema>;

export const adminClientSignInSchema = z.object({
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

export type AdminClientSignInValues = z.infer<typeof adminClientSignInSchema>;
