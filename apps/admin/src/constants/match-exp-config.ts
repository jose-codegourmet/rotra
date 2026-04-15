export type MatchExpConfigRow = {
	id: string;
	reason: string;
	defaultAmount: string;
	eligibility: string;
};

export const MATCH_EXP_CONFIG_DEFAULT_ROWS: MatchExpConfigRow[] = [
	{
		id: "match_played",
		reason: "match_played",
		defaultAmount: "+10",
		eligibility: "MMR club queue only",
	},
	{
		id: "match_won",
		reason: "match_won",
		defaultAmount: "+15",
		eligibility: "MMR club queue only",
	},
	{
		id: "match_voided_reversal",
		reason: "match_voided_reversal",
		defaultAmount: "-(original amount)",
		eligibility: "MMR club queue only (void operation)",
	},
];
