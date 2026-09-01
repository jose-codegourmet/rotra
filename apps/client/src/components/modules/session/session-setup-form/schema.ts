import { format } from "date-fns";
import { z } from "zod";
import { SESSION_SETUP_DURATION_HOURS } from "@/constants/mock-session-setup";

export const sessionSetupFormSchema = z.object({
	location: z
		.string()
		.trim()
		.min(2, "Location is required")
		.max(120, "Location must be 120 characters or fewer"),
	date: z
		.string()
		.min(1, "Date is required")
		.refine(
			(val) => val >= format(new Date(), "yyyy-MM-dd"),
			"Session date must be today or in the future",
		),
	startTime: z.string().min(1, "Start time is required"),
	durationHours: z
		.number()
		.refine(
			(value) =>
				SESSION_SETUP_DURATION_HOURS.includes(
					value as (typeof SESSION_SETUP_DURATION_HOURS)[number],
				),
			"Duration must be between 1 hour and 4 hours in 0.5 hour steps",
		),
	numCourts: z.coerce.number().int().min(1).max(12),
	playersPerCourt: z.coerce.number().int().min(2).max(4),
	format: z.enum(["singles", "doubles"]),
});

export type SessionSetupFormValues = z.infer<typeof sessionSetupFormSchema>;
