import type { CreatePlaceFormValues } from "./schema";

export function defaultCreatePlaceValues(): CreatePlaceFormValues {
	return {
		name: "",
		description: "",
		phone: "",
		website: "",
		location: {
			name: "",
			address: "",
			latitude: 10.3157,
			longitude: 123.8854,
		},
	};
}
