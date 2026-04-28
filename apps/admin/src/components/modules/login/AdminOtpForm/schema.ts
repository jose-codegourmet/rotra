import { z } from "zod";

export const otpFormSchema = z.object({
	token: z
		.string()
		.trim()
		.min(1, "Enter the one-time code.")
		.regex(/^\d{6}$/, "Enter a valid 6-digit code."),
});

export type OtpFormValues = z.infer<typeof otpFormSchema>;
