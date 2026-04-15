export type MmrAsymmetryConfigRow = {
	id: string;
	key: string;
	value: string;
	description: string;
};

export const MMR_ASYMMETRY_CONFIG_DEFAULT_ROWS: MmrAsymmetryConfigRow[] = [
	{
		id: "mmr_gap_threshold",
		key: "mmr_asymmetry_config.mmr_gap_threshold",
		value: "200",
		description: "MMR gap that enables mixed-rank asymmetry behavior.",
	},
	{
		id: "lower_rated_win_multiplier",
		key: "mmr_asymmetry_config.lower_rated_win_multiplier",
		value: "0.8",
		description:
			"Multiplier for lower-rated player on win when threshold is met.",
	},
	{
		id: "lower_rated_loss_multiplier",
		key: "mmr_asymmetry_config.lower_rated_loss_multiplier",
		value: "1.2",
		description:
			"Multiplier for lower-rated player on loss when threshold is met.",
	},
	{
		id: "higher_rated_win_multiplier",
		key: "mmr_asymmetry_config.higher_rated_win_multiplier",
		value: "1.2",
		description:
			"Multiplier for higher-rated player on win when threshold is met.",
	},
	{
		id: "higher_rated_loss_multiplier",
		key: "mmr_asymmetry_config.higher_rated_loss_multiplier",
		value: "0.8",
		description:
			"Multiplier for higher-rated player on loss when threshold is met.",
	},
];
