export function optionalText(value: string | null | undefined): string {
	return value ?? "—";
}

export function formatEnumLabel(value: string | null | undefined): string {
	if (value == null || value === "") return "—";
	return value
		.split("_")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}
