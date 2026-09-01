export type UmpireTeamId = "A" | "B";

export type UmpirePlayer = {
	name: string;
	initials: string;
	teamId: UmpireTeamId;
	teamLabel: string;
};

export const MOCK_UMPIRE_MATCH = {
	venue: "Smash Hub Ortigas",
	court: "Court 1",
	format: "Doubles",
	window: "7:00–9:00 PM",
	rules: "Rally scoring to 21, win by 2 · Best of 3",
	rulesShort: "Rally to 21, win by 2",
	bestOf: 3,
	brand: "ROTRA",
	tagline: "Run the game.",
	umpireChip: "Umpire · JO",
	umpireName: "Jo Cruz",
	umpireInitials: "JO",
	scoreboardNav: "Scoreboard",
	courtLabel: "Court",
	matchLabel: "Match",
	setsLabel: "Sets",
	pointCta: "+ Point",
	lastPointFlag: "Last point",
	undoCta: "Undo last point",
	submitLink: "Submit this match",
} as const;

export const MOCK_UMPIRE_TEAMS = {
	A: {
		id: "A" as const,
		label: "Team A",
		players: [
			{ name: "Jae Lim", initials: "JL" },
			{ name: "Mia Reyes", initials: "MR" },
		],
	},
	B: {
		id: "B" as const,
		label: "Team B",
		players: [
			{ name: "Kai Tan", initials: "KT" },
			{ name: "Lia Santos", initials: "LS" },
		],
	},
} as const;

export const MOCK_UMPIRE_PLAYERS: readonly UmpirePlayer[] = [
	{
		name: "Jae Lim",
		initials: "JL",
		teamId: "A",
		teamLabel: MOCK_UMPIRE_TEAMS.A.label,
	},
	{
		name: "Mia Reyes",
		initials: "MR",
		teamId: "A",
		teamLabel: MOCK_UMPIRE_TEAMS.A.label,
	},
	{
		name: "Kai Tan",
		initials: "KT",
		teamId: "B",
		teamLabel: MOCK_UMPIRE_TEAMS.B.label,
	},
	{
		name: "Lia Santos",
		initials: "LS",
		teamId: "B",
		teamLabel: MOCK_UMPIRE_TEAMS.B.label,
	},
];

export const MOCK_LIVE_SCORE = {
	eyebrow: "In progress · Set 1 of 3",
	headline: "Live score",
	youStatus: "Umpire · in progress",
	teamAPoints: 11,
	teamBPoints: 8,
	lastPoint: "A" as UmpireTeamId,
	currentSet: 1,
	setStatuses: ["Live", "Empty", "Empty"] as const,
} as const;

export const MOCK_SUBMIT_CONFIRM = {
	eyebrow: "Ready to lock",
	headline: "Submit this match?",
	resultTeam: "Team A",
	resultScore: "21–19",
	resultSets: "(2–0)",
	lockNote: "Scores lock after submit.",
	winsBadge: "Wins 2–0",
	youStatus: "Umpire · confirm",
	submitCta: "Submit match",
	cancelCta: "Cancel / keep scoring",
	lockedCta: "Scores locked",
	lockedNote: "This shell did not send a result.",
	sets: [
		{ label: "Set 1", score: "21–18", note: "A", done: true },
		{ label: "Set 2", score: "21–19", note: "A", done: true },
		{ label: "Set 3", score: "—", note: "Not played", done: false },
	],
} as const;

export function formatVenueLine(parts: readonly string[]): string {
	return parts.join(" · ");
}

export function formatSetScore(teamA: number, teamB: number): string {
	return `${teamA}–${teamB}`;
}
