export const tagDefinitionsRootKey = ["tag-definitions"] as const;

export function tagDefinitionsQueryKey() {
	return [...tagDefinitionsRootKey] as const;
}
