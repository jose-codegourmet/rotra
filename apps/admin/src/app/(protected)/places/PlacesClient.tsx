"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import { PlacesTable } from "@/components/modules/places/places-table/PlacesTable";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import { useDeletePlace, usePlacesQuery } from "@/hooks/usePlaces/client";
import type { ListPlacesResponse, PlaceRow } from "@/hooks/usePlaces/server";
import { cn } from "@/lib/utils/tailwind";

const CreatePlaceDialog = dynamic(
	() =>
		import(
			"@/components/modules/places/create-place-dialog/CreatePlaceDialog"
		).then((mod) => mod.CreatePlaceDialog),
	{ ssr: false },
);

const EditPlaceDialog = dynamic(
	() =>
		import(
			"@/components/modules/places/edit-place-dialog/EditPlaceDialog"
		).then((mod) => mod.EditPlaceDialog),
	{ ssr: false },
);

const ReviewPlaceDialog = dynamic(
	() =>
		import(
			"@/components/modules/places/review-place-dialog/ReviewPlaceDialog"
		).then((mod) => mod.ReviewPlaceDialog),
	{ ssr: false },
);

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
	const [createOpen, setCreateOpen] = React.useState(false);
	const [editTarget, setEditTarget] = React.useState<PlaceRow | null>(null);
	const [reviewTarget, setReviewTarget] = React.useState<PlaceRow | null>(null);
	const [deleteTarget, setDeleteTarget] = React.useState<PlaceRow | null>(null);

	const deleteMutation = useDeletePlace();

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

	const isDeleting = deleteMutation.isPending;

	function handleDeleteOpenChange(open: boolean) {
		if (isDeleting) return;
		if (!open) {
			setDeleteTarget(null);
		}
	}

	function handleConfirmDelete() {
		if (!deleteTarget || isDeleting) return;
		deleteMutation.mutate(
			{ id: deleteTarget.id },
			{
				onSuccess: () => {
					setDeleteTarget(null);
				},
			},
		);
	}

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-heading text-text-primary">Places</h1>
					<p className="mt-1 text-body text-text-secondary">
						Manage custom venue locations submitted by players and admins.
					</p>
				</div>
				<Button type="button" onClick={() => setCreateOpen(true)}>
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

			<PlacesTable
				data={filteredPlaces}
				onEdit={(place) => setEditTarget(place)}
				onConfirm={(place) => setReviewTarget(place)}
				onDelete={(place) => setDeleteTarget(place)}
			/>

			<CreatePlaceDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onSuccess={() => undefined}
				onError={() => undefined}
			/>

			{editTarget ? (
				<EditPlaceDialog
					place={editTarget}
					open
					onOpenChange={(open) => {
						if (!open) setEditTarget(null);
					}}
					onSuccess={() => undefined}
					onError={() => undefined}
				/>
			) : null}

			{reviewTarget ? (
				<ReviewPlaceDialog
					place={reviewTarget}
					open
					onOpenChange={(open) => {
						if (!open) setReviewTarget(null);
					}}
					onConfirmSuccess={() => undefined}
					onDeleteSuccess={() => undefined}
				/>
			) : null}

			<Dialog
				open={deleteTarget !== null}
				onOpenChange={handleDeleteOpenChange}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Delete place?</DialogTitle>
						<DialogDescription>
							This permanently removes{" "}
							<span className="font-medium text-text-primary">
								{deleteTarget?.name}
							</span>{" "}
							from the map. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isDeleting}
							onClick={() => setDeleteTarget(null)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={isDeleting}
							onClick={handleConfirmDelete}
						>
							{isDeleting ? "Deleting…" : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

PlacesClient.displayName = "PlacesClient";
