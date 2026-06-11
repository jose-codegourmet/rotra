import { z } from "zod";

export const createPlaceSchema = z.object({
	name: z.string().min(2, "Name is required").max(120),
	description: z.string().max(500).optional(),
	phone: z.string().max(30).optional(),
	website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
	location: z.object({
		name: z.string(),
		address: z.string().min(5, "Pick a location on the map"),
		latitude: z.number(),
		longitude: z.number(),
	}),
});

export type CreatePlaceFormValues = z.infer<typeof createPlaceSchema>;
