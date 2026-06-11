import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Brain,
	EyeOff,
	FlaskConical,
	LayoutDashboard,
	Mail,
	MapPin,
	Medal,
	ShieldAlert,
	SlidersHorizontal,
	Tag,
	UserCheck,
	UserCog,
	Users,
} from "lucide-react";

export const ADMIN_APP_DISPLAY_NAME = "ROTRA Admin";

export const ADMIN_APP_TAGLINE = "Internal platform operations";

/** Documented session policy — wire-up when auth exists. */
export const SESSION_IDLE_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export const ROUTES = {
	LOGIN: "/login",
	DASHBOARD: "/dashboard",
	ADMINS: "/admins",
	/** Customer (player) directory — non-admin profiles only */
	CUSTOMERS: "/customers",
	PLACES: "/places",
	KILL_SWITCHES: "/kill-switches",
	ENVIRONMENTS: "/environments",
	APPROVALS: "/approvals",
	MODERATION: "/moderation",
	PLATFORM_CONFIG: "/platform-config",
	MMR_MANAGEMENT: "/mmr-management",
	SKILLS_MANAGEMENT: "/skills-management",
	ANALYTICS: "/analytics",
	WAITLIST: "/waitlist",
	NOTIFICATIONS: "/notifications",
	PROFILE: "/profile",
	TAGS: "/tags",
	TESTERS: "/testers",
} as const;

export function adminDirectoryDetailPath(id: string): string {
	return `${ROUTES.ADMINS}/${id}`;
}

export function customerProfilePath(id: string): string {
	return `${ROUTES.CUSTOMERS}/${id}`;
}

export function tagDefinitionPath(id: string): string {
	return `${ROUTES.TAGS}?highlight=${id}`;
}

export function testerProfilePath(id: string): string {
	return `${ROUTES.TESTERS}/${id}`;
}

/** Header title per pathname (App Router paths). */
export const ADMIN_PAGE_TITLES: Record<string, string> = {
	[ROUTES.DASHBOARD]: "Dashboard",
	[ROUTES.ADMINS]: "Platform admins",
	[ROUTES.CUSTOMERS]: "Customers",
	[ROUTES.PLACES]: "Places",
	[ROUTES.KILL_SWITCHES]: "Kill switches",
	[ROUTES.ENVIRONMENTS]: "Environments",
	[ROUTES.APPROVALS]: "Approvals",
	[ROUTES.MODERATION]: "Moderation",
	[ROUTES.PLATFORM_CONFIG]: "Platform config",
	[ROUTES.MMR_MANAGEMENT]: "MMR management",
	[ROUTES.SKILLS_MANAGEMENT]: "Skills management",
	[ROUTES.ANALYTICS]: "Analytics",
	[ROUTES.WAITLIST]: "Waitlist",
	[ROUTES.NOTIFICATIONS]: "Notifications",
	[ROUTES.PROFILE]: "My profile",
	[ROUTES.TAGS]: "Tag definitions",
	[ROUTES.TESTERS]: "Testers",
};

export function getAdminShellPageTitle(pathname: string): string {
	const titled = ADMIN_PAGE_TITLES[pathname];
	if (titled) return titled;
	if (/^\/admins\/[^/]+$/.test(pathname)) return "Admin details";
	if (/^\/customers\/[^/]+$/.test(pathname)) return "Customer details";
	if (/^\/testers\/[^/]+$/.test(pathname)) return "Tester details";
	return "Admin";
}

export type AdminNavItem = {
	label: string;
	href: string;
	icon: LucideIcon;
	/** Hidden unless the signed-in admin is a super admin. */
	superAdminOnly?: boolean;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
	{
		label: "Dashboard",
		href: ROUTES.DASHBOARD,
		icon: LayoutDashboard,
	},
	{
		label: "Admins",
		href: ROUTES.ADMINS,
		icon: UserCog,
	},
	{
		label: "Customers",
		href: ROUTES.CUSTOMERS,
		icon: Users,
	},
	{
		label: "Places",
		href: ROUTES.PLACES,
		icon: MapPin,
	},
	{
		label: "Tags",
		href: ROUTES.TAGS,
		icon: Tag,
		superAdminOnly: true,
	},
	{
		label: "Testers",
		href: ROUTES.TESTERS,
		icon: FlaskConical,
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
