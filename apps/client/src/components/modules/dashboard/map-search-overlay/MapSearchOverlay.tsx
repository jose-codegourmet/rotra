"use client";

import { Building2, Loader2, MapPin, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FilterPanel } from "@/components/modules/dashboard/filter-panel/FilterPanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs/Tabs";
import type { GeolocationStatus } from "@/hooks/useGeolocation";
import { forwardGeocode, type GeocodingSuggestion } from "@/lib/geo/geocode";
import { cn } from "@/lib/utils";
import type {
	SessionGeoPoint,
	VenueSessionGroup,
} from "@/types/session-discovery";

type SearchMode = "place" | "club";

interface MapSearchOverlayProps {
	locationLabel: string;
	geoStatus: GeolocationStatus;
	nearbyOnly: boolean;
	doublesOnly: boolean;
	weekendOnly: boolean;
	onToggleNearby: () => void;
	onToggleDoubles: () => void;
	onToggleWeekend: () => void;
	onRecenter?: () => void;
	onPlaceSelect: (center: SessionGeoPoint) => void;
	clubQuery: string;
	onClubQueryChange: (query: string) => void;
	venueGroups: VenueSessionGroup[];
	slotAvailability: "full" | "not_full" | undefined;
	onSlotAvailabilityChange: (value: "full" | "not_full" | undefined) => void;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(timer);
	}, [value, delayMs]);

	return debounced;
}

export function MapSearchOverlay({
	locationLabel,
	geoStatus,
	nearbyOnly,
	doublesOnly,
	weekendOnly,
	onToggleNearby,
	onToggleDoubles,
	onToggleWeekend,
	onRecenter,
	onPlaceSelect,
	clubQuery,
	onClubQueryChange,
	venueGroups,
	slotAvailability,
	onSlotAvailabilityChange,
}: MapSearchOverlayProps) {
	const [searchMode, setSearchMode] = useState<SearchMode>("place");
	const [placeInput, setPlaceInput] = useState("");
	const [clubInput, setClubInput] = useState(clubQuery);
	const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [filterPanelOpen, setFilterPanelOpen] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const debouncedPlaceInput = useDebouncedValue(placeInput, 300);
	const debouncedClubInput = useDebouncedValue(clubInput, 300);

	const placePlaceholder =
		geoStatus === "loading"
			? "Locating you…"
			: locationLabel || "Province, city, street…";

	const hasActivePanelFilters = slotAvailability != null;

	useEffect(() => {
		onClubQueryChange(debouncedClubInput);
	}, [debouncedClubInput, onClubQueryChange]);

	useEffect(() => {
		setClubInput(clubQuery);
	}, [clubQuery]);

	useEffect(() => {
		if (searchMode !== "place") {
			setSuggestions([]);
			return;
		}

		const query = debouncedPlaceInput.trim();
		if (!query) {
			setSuggestions([]);
			setIsGeocoding(false);
			return;
		}

		const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
		if (!token) {
			setSuggestions([]);
			return;
		}

		let cancelled = false;
		setIsGeocoding(true);

		void forwardGeocode(query, token).then((results) => {
			if (cancelled) return;
			setSuggestions(results);
			setIsGeocoding(false);
			setShowSuggestions(results.length > 0);
		});

		return () => {
			cancelled = true;
		};
	}, [debouncedPlaceInput, searchMode]);

	const handlePlaceSuggestionSelect = useCallback(
		(suggestion: GeocodingSuggestion) => {
			onPlaceSelect({
				lat: suggestion.center[1],
				lng: suggestion.center[0],
			});
			setPlaceInput("");
			setSuggestions([]);
			setShowSuggestions(false);
		},
		[onPlaceSelect],
	);

	const handlePlaceInputKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Enter" && suggestions[0]) {
			handlePlaceSuggestionSelect(suggestions[0]);
		}
	};

	const handlePlaceInputFocus = () => {
		if (suggestions.length > 0) {
			setShowSuggestions(true);
		}
	};

	const handlePlaceRecenter = () => {
		if (!placeInput.trim()) {
			onRecenter?.();
		}
	};

	return (
		<div className="pointer-events-auto absolute top-4 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4">
			<div className="rounded-2xl border border-outline-variant/10 bg-bg-base/90 p-4 shadow-2xl backdrop-blur-xl">
				<Tabs
					value={searchMode}
					onValueChange={(value) => setSearchMode(value as SearchMode)}
				>
					<div className="flex items-center gap-2">
						<TabsList className="h-auto shrink-0 gap-1 border-0 bg-transparent p-0">
							<TabsTrigger
								value="place"
								className="size-10 rounded-xl p-0 data-[state=active]:bg-accent data-[state=active]:text-bg-base"
								aria-label="Search by place"
							>
								<MapPin size={16} />
							</TabsTrigger>
							<TabsTrigger
								value="club"
								className="size-10 rounded-xl p-0 data-[state=active]:bg-accent data-[state=active]:text-bg-base"
								aria-label="Search by club"
							>
								<Building2 size={16} />
							</TabsTrigger>
						</TabsList>

						<div className="relative min-w-0 flex-1">
							{searchMode === "place" ? (
								<input
									type="text"
									value={placeInput}
									onChange={(event) => setPlaceInput(event.target.value)}
									onFocus={handlePlaceInputFocus}
									onKeyDown={handlePlaceInputKeyDown}
									onClick={handlePlaceRecenter}
									placeholder={placePlaceholder}
									className="w-full rounded-xl border border-outline-variant/10 bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary"
									aria-label="Search by place"
								/>
							) : (
								<input
									type="text"
									value={clubInput}
									onChange={(event) => setClubInput(event.target.value)}
									placeholder="Search clubs…"
									className="w-full rounded-xl border border-outline-variant/10 bg-bg-elevated px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary"
									aria-label="Search clubs"
								/>
							)}

							{searchMode === "place" && isGeocoding && (
								<Loader2
									size={16}
									className="absolute top-1/2 right-3 -translate-y-1/2 animate-spin text-accent"
								/>
							)}

							{searchMode === "place" &&
								showSuggestions &&
								suggestions.length > 0 && (
									<ul className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl border border-outline-variant/10 bg-bg-base shadow-xl">
										{suggestions.map((suggestion) => (
											<li key={suggestion.id}>
												<button
													type="button"
													onClick={() =>
														handlePlaceSuggestionSelect(suggestion)
													}
													className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated"
												>
													<MapPin
														size={14}
														className="mt-0.5 shrink-0 text-accent"
													/>
													<span className="truncate">
														{suggestion.placeName}
													</span>
												</button>
											</li>
										))}
									</ul>
								)}
						</div>

						<FilterPanel
							open={filterPanelOpen}
							onOpenChange={setFilterPanelOpen}
							venueGroups={venueGroups}
							activeFilters={
								slotAvailability
									? { slotAvailability }
									: {}
							}
							onApply={(filters) =>
								onSlotAvailabilityChange(filters.slotAvailability)
							}
							trigger={
								<button
									type="button"
									className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-outline-variant/10 bg-bg-elevated text-text-secondary"
									aria-label="Filters"
								>
									<SlidersHorizontal size={18} />
									{hasActivePanelFilters && (
										<span className="absolute top-2 right-2 size-2 rounded-full bg-accent" />
									)}
								</button>
							}
						/>
					</div>
				</Tabs>

				<div className="mt-3 flex gap-2 overflow-x-auto pb-1">
					<FilterChip
						active={nearbyOnly}
						onClick={onToggleNearby}
						label="Nearby (< 2km)"
					/>
					<FilterChip
						active={doublesOnly}
						onClick={onToggleDoubles}
						label="Doubles Only"
					/>
					<FilterChip
						active={weekendOnly}
						onClick={onToggleWeekend}
						label="Weekend"
					/>
				</div>
			</div>
		</div>
	);
}

function FilterChip({
	active,
	onClick,
	label,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold tracking-tighter whitespace-nowrap uppercase",
				active
					? "border-accent/20 bg-accent/5 text-accent"
					: "border-outline-variant/10 bg-bg-elevated text-text-secondary",
			)}
		>
			{label}
		</button>
	);
}
