import { z } from "zod";

export const quickSessionFormSchema = z.object({
	clubId: z
		.union([z.string().uuid("Select a valid club"), z.literal("")])
		.optional(),

	venue: z.object({
		name: z.string().min(2, "Venue name is required").max(120),
		address: z.string().max(200).optional(),
		latitude: z.number().nullable().optional(),
		longitude: z.number().nullable().optional(),
		placeId: z.string().uuid().optional(),
		isNewSubmission: z.boolean().optional(),
	}),

	date: z.string().min(1, "Date is required"),
	startTime: z.string().min(1, "Start time is required"),
	numCourts: z.coerce.number().int().min(1).max(12),
	playersPerCourt: z.enum(["2", "4"]),
	matchFormat: z.enum(["best_of_1", "best_of_3"]),
	scoreLimit: z.coerce.number().int().min(11).max(30),
	visibility: z.enum(["club_members", "open"]),
});

export type QuickSessionFormValues = z.infer<typeof quickSessionFormSchema>;
