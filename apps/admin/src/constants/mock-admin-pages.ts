/** Static mock data for admin UI — no API. */

export type DashboardKpi = {
	id: string;
	label: string;
	value: string;
	hint: string;
};

export const MOCK_DASHBOARD_KPIS: DashboardKpi[] = [
	{
		id: "clubs",
		label: "Active clubs",
		value: "128",
		hint: "+6 vs last week",
	},
	{
		id: "sessions",
		label: "Sessions (7d)",
		value: "4,092",
		hint: "Court bookings",
	},
	{
		id: "players",
		label: "Weekly active players",
		value: "18.4k",
		hint: "Unique logins",
	},
	{
		id: "queues",
		label: "Live queues now",
		value: "37",
		hint: "Across all clubs",
	},
];

export type DashboardActivity = {
	id: string;
	summary: string;
	time: string;
};

export const MOCK_DASHBOARD_ACTIVITY: DashboardActivity[] = [
	{
		id: "1",
		summary: "Kill switch toggled: `payments_stripe` → off",
		time: "12 min ago",
	},
	{
		id: "2",
		summary: "Club owner approved: North Court Collective",
		time: "1 hr ago",
	},
	{
		id: "3",
		summary: "Platform config updated: tier Gold threshold",
		time: "3 hr ago",
	},
	{
		id: "4",
		summary: "Review flagged: 2-star club review",
		time: "5 hr ago",
	},
];

export type KillSwitchRow = {
	id: string;
	key: string;
	label: string;
	description: string;
	enabled: boolean;
	category: string;
};

export const MOCK_KILL_SWITCHES: KillSwitchRow[] = [
	{
		id: "ks1",
		key: "sessions_booking",
		label: "Session booking",
		description: "Players can join or leave session queues.",
		enabled: true,
		category: "Core",
	},
	{
		id: "ks2",
		key: "payments_stripe",
		label: "Stripe payments",
		description: "Paid tiers and add-ons checkout.",
		enabled: true,
		category: "Billing",
	},
	{
		id: "ks3",
		key: "social_reviews",
		label: "Club reviews",
		description: "Posting and viewing club reviews.",
		enabled: false,
		category: "Social",
	},
	{
		id: "ks4",
		key: "owner_applications",
		label: "Owner applications",
		description: "New club owner signup flow.",
		enabled: true,
		category: "Growth",
	},
	{
		id: "ks5",
		key: "umpire_live_scoring",
		label: "Live scoring (umpire)",
		description: "Real-time score entry during matches.",
		enabled: true,
		category: "Sessions",
	},
];

export type EnvironmentRow = {
	id: string;
	name: string;
	slug: string;
	apiBase: string;
	isDefault: boolean;
	lastDeploy: string;
};

export const MOCK_ENVIRONMENTS: EnvironmentRow[] = [
	{
		id: "e1",
		name: "Development",
		slug: "dev",
		apiBase: "https://api.dev.rotra.internal",
		isDefault: false,
		lastDeploy: "2026-04-11",
	},
	{
		id: "e2",
		name: "Staging",
		slug: "staging",
		apiBase: "https://api.staging.rotra.app",
		isDefault: false,
		lastDeploy: "2026-04-10",
	},
	{
		id: "e3",
		name: "Production",
		slug: "prod",
		apiBase: "https://api.rotra.app",
		isDefault: true,
		lastDeploy: "2026-04-08",
	},
];

export type ApprovalRow = {
	id: string;
	applicantName: string;
	email: string;
	clubName: string;
	city: string;
	submittedAt: string;
	status: "pending" | "in_review";
};

export const MOCK_APPROVALS: ApprovalRow[] = [
	{
		id: "a1",
		applicantName: "Maya Singh",
		email: "maya.singh@example.com",
		clubName: "Skyline Badminton Hub",
		city: "Singapore",
		submittedAt: "2026-04-12",
		status: "pending",
	},
	{
		id: "a2",
		applicantName: "Jon Reyes",
		email: "jon.reyes@example.com",
		clubName: "East Valley Courts",
		city: "Manila",
		submittedAt: "2026-04-11",
		status: "in_review",
	},
	{
		id: "a3",
		applicantName: "Sora Tanaka",
		email: "sora.t@example.com",
		clubName: "Midtown Shuttle Club",
		city: "Tokyo",
		submittedAt: "2026-04-09",
		status: "pending",
	},
];

export type ModerationRow = {
	id: string;
	type: string;
	target: string;
	reason: string;
	priority: "low" | "medium" | "high";
	status: "open" | "escalated";
	openedAt: string;
};

export const MOCK_MODERATION: ModerationRow[] = [
	{
		id: "m1",
		type: "Review",
		target: "Club: Skyline · Review #8821",
		reason: "Reported as spam / off-topic",
		priority: "medium",
		status: "open",
		openedAt: "2026-04-12",
	},
	{
		id: "m2",
		type: "Account",
		target: "User: @rapid_queue_bot",
		reason: "Suspected bot activity in queues",
		priority: "high",
		status: "escalated",
		openedAt: "2026-04-11",
	},
	{
		id: "m3",
		type: "Content",
		target: "Announcement: East Valley",
		reason: "Policy — promotional external link",
		priority: "low",
		status: "open",
		openedAt: "2026-04-10",
	},
];

export type ConfigRow = {
	id: string;
	category: string;
	key: string;
	value: string;
	unit?: string;
};

export const MOCK_PLATFORM_CONFIG: ConfigRow[] = [
	{
		id: "c1",
		category: "Gamification",
		key: "exp_per_session_win",
		value: "120",
		unit: "EXP",
	},
	{
		id: "c2",
		category: "Gamification",
		key: "tier_gold_mmr_floor",
		value: "1650",
	},
	{
		id: "c3",
		category: "Gamification",
		key: "daily_quest_cap",
		value: "3",
	},
	{
		id: "c4",
		category: "Skill model",
		key: "dimensions_version",
		value: "2026.1",
	},
	{
		id: "c5",
		category: "Skill model",
		key: "default_rating_scale",
		value: "1–10",
	},
];

export type AnalyticsKpi = {
	id: string;
	label: string;
	value: string;
	change: string;
	positive: boolean;
};

export const MOCK_ANALYTICS_KPIS: AnalyticsKpi[] = [
	{
		id: "k1",
		label: "New clubs (28d)",
		value: "14",
		change: "+3",
		positive: true,
	},
	{
		id: "k2",
		label: "Session completion rate",
		value: "94.2%",
		change: "+0.6pp",
		positive: true,
	},
	{
		id: "k3",
		label: "Churn (30d)",
		value: "2.1%",
		change: "+0.2pp",
		positive: false,
	},
	{
		id: "k4",
		label: "Median queue wait",
		value: "8m",
		change: "−1m",
		positive: true,
	},
];

export type TopClubRow = {
	id: string;
	rank: number;
	name: string;
	sessions7d: number;
	players: number;
};

export const MOCK_TOP_CLUBS: TopClubRow[] = [
	{
		id: "t1",
		rank: 1,
		name: "Skyline Badminton Hub",
		sessions7d: 412,
		players: 890,
	},
	{
		id: "t2",
		rank: 2,
		name: "East Valley Courts",
		sessions7d: 301,
		players: 620,
	},
	{
		id: "t3",
		rank: 3,
		name: "Midtown Shuttle Club",
		sessions7d: 276,
		players: 540,
	},
	{
		id: "t4",
		rank: 4,
		name: "Harbor Sports Center",
		sessions7d: 198,
		players: 410,
	},
	{
		id: "t5",
		rank: 5,
		name: "North Court Collective",
		sessions7d: 165,
		players: 355,
	},
];
