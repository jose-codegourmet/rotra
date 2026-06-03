import { z } from "zod";

export const loginTesterSchema = z.object({
	email: z.string().email("Enter a valid email address."),
	testerPassword: z.string().min(1, "Tester password is required."),
});

export type LoginTesterValues = z.infer<typeof loginTesterSchema>;
