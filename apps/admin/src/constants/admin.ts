import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Brain,
	EyeOff,
	LayoutDashboard,
	Mail,
	Medal,
	ShieldAlert,
	SlidersHorizontal,
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
	MMR_MANAGEMENT: "/mmr-management",
	SKILLS_MANAGEMENT: "/skills-management",
	ANALYTICS: "/analytics",
	WAITLIST: "/waitlist",
} as const;

export function adminUserDetailPath(id: string): string {
	return `${ROUTES.USERS}/${id}`;
}

/** Header title per pathname (App Router paths). */
export const ADMIN_PAGE_TITLES: Record<string, string> = {
	[ROUTES.DASHBOARD]: "Dashboard",
	[ROUTES.USERS]: "Users",
	[ROUTES.KILL_SWITCHES]: "Kill switches",
	[ROUTES.ENVIRONMENTS]: "Environments",
	[ROUTES.APPROVALS]: "Approvals",
	[ROUTES.MODERATION]: "Moderation",
	[ROUTES.PLATFORM_CONFIG]: "Platform config",
	[ROUTES.MMR_MANAGEMENT]: "MMR management",
	[ROUTES.SKILLS_MANAGEMENT]: "Skills management",
	[ROUTES.ANALYTICS]: "Analytics",
	[ROUTES.WAITLIST]: "Waitlist",
};

export function getAdminShellPageTitle(pathname: string): string {
	const titled = ADMIN_PAGE_TITLES[pathname];
	if (titled) return titled;
	if (/^\/users\/[^/]+$/.test(pathname)) return "User details";
	return "Admin";
}

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
		label: "Waitlist",
		href: ROUTES.WAITLIST,
		icon: Mail,
	},
	{
		label: "Kill switches",
		href: ROUTES.KILL_SWITCHES,
		icon: EyeOff,
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
		icon: SlidersHorizontal,
	},
	{
		label: "MMR management",
		href: ROUTES.MMR_MANAGEMENT,
		icon: Medal,
	},
	{
		label: "Skills management",
		href: ROUTES.SKILLS_MANAGEMENT,
		icon: Brain,
	},
	{
		label: "Analytics",
		href: ROUTES.ANALYTICS,
		icon: BarChart3,
	},
];
