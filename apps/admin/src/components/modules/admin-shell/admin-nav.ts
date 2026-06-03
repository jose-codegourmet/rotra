import { ROUTES } from "@/constants/admin";

const PREFIX_MATCH_ROUTES: readonly string[] = [
	ROUTES.ADMINS,
	ROUTES.CUSTOMERS,
	ROUTES.TESTERS,
];

export function navItemIsActive(href: string, pathname: string): boolean {
	if (PREFIX_MATCH_ROUTES.includes(href)) {
		return pathname === href || pathname.startsWith(`${href}/`);
	}
	return pathname === href;
}
