import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Globe,
	LayoutDashboard,
	Settings2,
	ShieldAlert,
	ToggleLeft,
	UserCheck,
	Users,
} from "lucide-react";

export const ADMIN_APP_DISPLAY_NAME = "ROTRA Admin";

export const ADMIN_APP_TAGLINE = "Internal platform operations";

/** Documented session policy — wire-up when auth exists. */
export const SESSION_IDLE_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export const ROUTES = {
	LOGIN: "/login",
	DASHBOARD: "/dashboard",
	USERS: "/users",
	KILL_SWITCHES: "/kill-switches",
	ENVIRONMENTS: "/environments",
	APPROVALS: "/approvals",
	MODERATION: "/moderation",
	PLATFORM_CONFIG: "/platform-config",
	ANALYTICS: "/analytics",
} as const;

/** Header title per pathname (App Router paths). */
export const ADMIN_PAGE_TITLES: Record<string, string> = {
	[ROUTES.DASHBOARD]: "Dashboard",
	[ROUTES.USERS]: "Users",
	[ROUTES.KILL_SWITCHES]: "Kill switches",
	[ROUTES.ENVIRONMENTS]: "Environments",
	[ROUTES.APPROVALS]: "Approvals",
	[ROUTES.MODERATION]: "Moderation",
	[ROUTES.PLATFORM_CONFIG]: "Platform config",
	[ROUTES.ANALYTICS]: "Analytics",
};

export type AdminNavItem = {
	label: string;
	href: string;
	icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
	{
		label: "Dashboard",
		href: ROUTES.DASHBOARD,
		icon: LayoutDashboard,
	},
	{
		label: "Users",
		href: ROUTES.USERS,
		icon: Users,
	},
	{
		label: "Kill switches",
		href: ROUTES.KILL_SWITCHES,
		icon: ToggleLeft,
	},
	{
		label: "Environments",
		href: ROUTES.ENVIRONMENTS,
		icon: Globe,
	},
	{
		label: "Approvals",
		href: ROUTES.APPROVALS,
		icon: UserCheck,
	},
	{
		label: "Moderation",
		href: ROUTES.MODERATION,
		icon: ShieldAlert,
	},
	{
		label: "Platform config",
		href: ROUTES.PLATFORM_CONFIG,
		icon: Settings2,
	},
	{
		label: "Analytics",
		href: ROUTES.ANALYTICS,
		icon: BarChart3,
	},
];
