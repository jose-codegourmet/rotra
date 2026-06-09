"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MOCK_VENUE_GROUPS } from "@/constants/mock-venue-groups";
import { MapSearchOverlay } from "./MapSearchOverlay";

const meta: Meta<typeof MapSearchOverlay> = {
	title: "dashboard/MapSearchOverlay",
	component: MapSearchOverlay,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="relative min-h-[280px] bg-bg-base">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof MapSearchOverlay>;

function MapSearchOverlayDemo(
	props: Partial<React.ComponentProps<typeof MapSearchOverlay>>,
) {
	const [clubQuery, setClubQuery] = useState(props.clubQuery ?? "");
	const [slotAvailability, setSlotAvailability] = useState<
		"full" | "not_full" | undefined
	>(props.slotAvailability);

	return (
		<MapSearchOverlay
			locationLabel={props.locationLabel ?? "Cebu City"}
			geoStatus={props.geoStatus ?? "granted"}
			nearbyOnly={props.nearbyOnly ?? true}
			doublesOnly={props.doublesOnly ?? false}
			weekendOnly={props.weekendOnly ?? false}
			onToggleNearby={() => {}}
			onToggleDoubles={() => {}}
			onToggleWeekend={() => {}}
			onRecenter={() => {}}
			onPlaceSelect={() => {}}
			clubQuery={clubQuery}
			onClubQueryChange={setClubQuery}
			venueGroups={props.venueGroups ?? MOCK_VENUE_GROUPS}
			slotAvailability={slotAvailability}
			onSlotAvailabilityChange={setSlotAvailability}
		/>
	);
}

export const PlaceModeDefault: Story = {
	render: () => <MapSearchOverlayDemo />,
};

export const ClubMode: Story = {
	render: () => <MapSearchOverlayDemo clubQuery="Sunrise" />,
};

export const FiltersActive: Story = {
	render: () => (
		<MapSearchOverlayDemo slotAvailability="not_full" doublesOnly weekendOnly />
	),
};

export const NoGeolocation: Story = {
	render: () => (
		<MapSearchOverlayDemo
			locationLabel=""
			geoStatus="denied"
			nearbyOnly={false}
		/>
	),
};
