import { CalendarClock, Gauge, Trophy, User } from "lucide-react";

export type NavItemId = "home" | "clubs" | "sessions" | "profile";

export const NAV_ITEMS = [
	{ id: "home" as NavItemId, label: "Home", Icon: Gauge },
	{ id: "clubs" as NavItemId, label: "Clubs", Icon: Trophy },
	{ id: "sessions" as NavItemId, label: "Sessions", Icon: CalendarClock },
	{ id: "profile" as NavItemId, label: "Profile", Icon: User },
];
