import {
	CourtPosition,
	FormatPreference,
	PlayingLevel,
	PlayMode,
} from "@prisma/client";
import { z } from "zod";

export const editCustomerSkillsFormSchema = z.object({
	playingLevel: z.union([z.literal(""), z.nativeEnum(PlayingLevel)]),
	formatPreference: z.union([z.literal(""), z.nativeEnum(FormatPreference)]),
	courtPosition: z.union([z.literal(""), z.nativeEnum(CourtPosition)]),
	playMode: z.union([z.literal(""), z.nativeEnum(PlayMode)]),
});

export type EditCustomerSkillsFormValues = z.infer<
	typeof editCustomerSkillsFormSchema
>;
