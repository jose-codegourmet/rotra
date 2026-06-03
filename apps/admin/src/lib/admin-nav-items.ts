import type { AdminRole } from "@prisma/client";
import { ADMIN_NAV_ITEMS, type AdminNavItem } from "@/constants/admin";

export function filterAdminNavItems(
	adminRole: AdminRole,
	items: AdminNavItem[] = ADMIN_NAV_ITEMS,
): AdminNavItem[] {
	return items.filter(
		(item) => !item.superAdminOnly || adminRole === "super_admin",
	);
}
