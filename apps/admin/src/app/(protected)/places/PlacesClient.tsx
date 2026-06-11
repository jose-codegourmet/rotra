"use client";

import * as React from "react";

import { PlacesTable } from "@/components/modules/places/places-table/PlacesTable";
import { Button } from "@/components/ui/button/Button";
import { usePlacesQuery } from "@/hooks/usePlaces/client";
import type { ListPlacesResponse } from "@/hooks/usePlaces/server";
import { cn } from "@/lib/utils/tailwind";

type PlacesTab = "all" | "confirmed" | "unreviewed";

const TABS: Array<{ id: PlacesTab; label: string }> = [
	{ id: "all", label: "All" },
	{ id: "confirmed", label: "Confirmed" },
	{ id: "unreviewed", label: "Unreviewed" },
];

export type PlacesClientProps = {
	initialPlaces: ListPlacesResponse;
};

export function PlacesClient({ initialPlaces }: PlacesClientProps) {
	const [activeTab, setActiveTab] = React.useState<PlacesTab>("all");

	const { data, isFetching } = usePlacesQuery(undefined, {
		initialData: initialPlaces,
	});

	const places = data?.places ?? initialPlaces.places;

	const unreviewedCount = React.useMemo(
		() => places.filter((place) => place.status === "unreviewed").length,
		[places],
	);

	const filteredPlaces = React.useMemo(() => {
		if (activeTab === "all") return places;
		return places.filter((place) => place.status === activeTab);
	}, [activeTab, places]);

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-heading text-text-primary">Places</h1>
					<p className="mt-1 text-body text-text-secondary">
						Manage custom venue locations submitted by players and admins.
					</p>
				</div>
				<Button type="button" disabled>
					Add Place
				</Button>
			</div>

			<nav
				className="flex flex-wrap gap-1 border-b border-border pb-0"
				aria-label="Places filters"
			>
				{TABS.map((tab) => {
					const active = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"-mb-px flex items-center gap-2 rounded-t-md border border-transparent px-4 py-2.5 text-small font-bold uppercase tracking-widest transition-colors",
								active
									? "border-border border-b-bg-base bg-bg-base text-accent"
									: "border-b-transparent text-text-secondary hover:text-text-primary",
							)}
						>
							<span>{tab.label}</span>
							{tab.id === "unreviewed" && unreviewedCount > 0 ? (
								<span className="inline-flex min-w-5 items-center justify-center rounded-full bg-warning/15 px-1.5 py-0.5 text-micro font-bold text-warning">
									{unreviewedCount}
								</span>
							) : null}
						</button>
					);
				})}
			</nav>

			{isFetching ? (
				<p className="text-small text-text-secondary">Refreshing places…</p>
			) : null}

			<PlacesTable data={filteredPlaces} />
		</div>
	);
}

PlacesClient.displayName = "PlacesClient";
