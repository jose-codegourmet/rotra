export const MOCK_SESSION_SETUP_VALUES = {
	location: "Smash Hub Ortigas",
	date: "2026-08-23",
	startTime: "19:00",
	durationHours: 2,
	numCourts: 2,
	playersPerCourt: 4,
	format: "doubles" as const,
};

export const SESSION_SETUP_DURATION_HOURS = [
	1, 1.5, 2, 2.5, 3, 3.5, 4,
] as const;

export const SESSION_SETUP_COURTS = { min: 1, max: 12 } as const;
export const SESSION_SETUP_PLAYERS = { min: 2, max: 4, step: 2 } as const;
