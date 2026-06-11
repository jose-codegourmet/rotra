import {
	createPlaceSchema,
	type CreatePlaceFormValues,
} from "../create-place-dialog/schema";

export const editPlaceSchema = createPlaceSchema;

export type EditPlaceFormValues = CreatePlaceFormValues;
