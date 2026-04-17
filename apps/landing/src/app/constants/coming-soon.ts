/** Pure copy fixtures for the coming-soon landing — see docs/marketing/coming_soon_landing_page.md */

export const comingSoonMeta = {
	badge: "Coming soon",
	headlineLead: "Queue. Play.",
	headlineAccent: "Track.",
	subcopy:
		"The operating system for badminton club nights — fair rotation, live queue state, and history you can trust.",
	tagline: "Run the game.",
	waitlistPlaceholder: "Enter your email",
	waitlistHelper: "We'll only email you about the launch and early access.",
	waitlistFinePrint:
		"Technical enrollment phase 01 — limited early access while we ship.",
	navCta: "Get early access",
	waitlistSubmit: "Join the waitlist",
	secondaryCta: "Join the waitlist",
} as const;

export const architectureSection = {
	eyebrow: "Core architecture",
	title: "High-efficiency session stack",
	intro:
		"Designed for players and clubs who want predictable court time, live session state, and records that match reality.",
} as const;

export type LandingModule = {
	id: string;
	title: string;
	body: string;
	icon: "list-ordered" | "radio" | "user" | "scale" | "users" | "wallet";
};

export const landingModules: readonly LandingModule[] = [
	{
		id: "01",
		title: "Fair queues",
		body: "Structured rotation so court time is predictable — less arguing over who's up next.",
		icon: "list-ordered",
	},
	{
		id: "02",
		title: "Live sessions",
		body: "Queue and match state stay current so players and que masters are not working off stale info.",
		icon: "radio",
	},
	{
		id: "03",
		title: "Player stats & identity",
		body: "Profiles and match history that persist across clubs you play in.",
		icon: "user",
	},
	{
		id: "04",
		title: "Reviews & skill signal",
		body: "Post-match reviews and skill signals that stay credible and tied to real play.",
		icon: "scale",
	},
	{
		id: "05",
		title: "Club sessions & members",
		body: "Clubs as the unit for sessions, invites, and membership — the way communities already organize.",
		icon: "users",
	},
	{
		id: "06",
		title: "Court & shuttle costs",
		body: "Transparent splits for courts and shuttles so money conversations match what actually happened.",
		icon: "wallet",
	},
] as const;

export const communitySection = {
	eyebrow: "Stay in the loop",
	title: "Join the waitlist community",
	body: "Updates on launch, clubs, and how sessions work in ROTRA — no spam.",
	statusChips: [
		{ label: "Early access", href: "#waitlist" },
		{ label: "Changelog", href: "#footer-docs" },
		{ label: "Support", href: "#footer-support" },
	],
} as const;

export const socialPlaceholders = [
	{ name: "Facebook", href: "#" },
	{ name: "Instagram", href: "#" },
	{ name: "Discord", href: "#" },
] as const;

export const footerContent = {
	copyright: "ROTRA. All rights reserved.",
	links: [
		{ label: "Privacy", href: "#privacy" },
		{ label: "Terms", href: "#terms" },
		{ label: "Changelog", href: "#footer-docs" },
		{ label: "Join the waitlist", href: "#waitlist" },
		{ label: "Support", href: "#footer-support" },
	],
} as const;

export const heroImage = {
	src: "/images/coming-soon-hero.svg",
	alt: "Abstract dark badminton court atmosphere",
} as const;
