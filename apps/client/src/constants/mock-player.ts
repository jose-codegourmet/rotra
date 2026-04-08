export const MOCK_PLAYER = {
	id: "u1",
	name: "Alex Santos",
	level: "Intermediate",
	tier: "Warrior 2",
	exp: 620,
	initials: "AS",
	stats: [
		{ label: "Games", value: "42" },
		{ label: "Wins", value: "28" },
		{ label: "Win Rate", value: "67%", accent: true },
		{ label: "Sessions", value: "12" },
		{ label: "Clubs", value: "3" },
		{ label: "Rating", value: "★ 3.8", accent: true },
	],
	playStyle: ["Doubles", "Front Court", "Social"],
	gear: [
		{
			category: "RACKETS",
			items: [
				{
					title: "Main Racket",
					brand: "Yonex",
					model: "Astrox 99",
					specs: ["Head Heavy", "BG80", "26 lbs"],
				},
			],
		},
		{ category: "SHOES", items: [] },
	],
	recentMatches: [
		{
			id: "m1",
			date: "Mar 22",
			club: "Sunrise BC",
			result: "W",
			teams: "Alex+Maria vs Jose+Ana",
			score: "21 – 15",
		},
		{
			id: "m2",
			date: "Mar 15",
			club: "Sunrise BC",
			result: "L",
			teams: "Alex+Jose vs Maria+Ana",
			score: "14 – 21",
		},
	],
};

export const SKILL_RATINGS = [4.1, 3.5, 3.2, 3.8, 4.0, 3.6];

export const ADVANCED_STATS = [
	{ label: "Most frequent partner", value: "Maria Cruz" },
	{ label: "Best partner win rate", value: "80%" },
	{ label: "Toughest opponent", value: "Jose B." },
	{ label: "Peak skill rating", value: "★ 4.1" },
];
