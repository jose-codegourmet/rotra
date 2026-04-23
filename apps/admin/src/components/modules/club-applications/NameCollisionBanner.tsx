"use client";

import type { ClubNameCollisionDto } from "@/hooks/useClubApplications/server";

export type NameCollisionBannerProps = {
	clubs: ClubNameCollisionDto[];
};

export function NameCollisionBanner({ clubs }: NameCollisionBannerProps) {
	if (clubs.length === 0) return null;

	return (
		<div
			className="rounded-lg border border-warning/50 bg-bg-elevated p-3 text-small text-text-secondary"
			role="status"
		>
			<p className="text-micro font-bold uppercase tracking-widest text-warning mb-2">
				Similar club names
			</p>
			<p className="text-small text-text-primary mb-2">
				These existing clubs use the same name (case-insensitive). Disambiguate
				using city and owner before approving.
			</p>
			<ul className="space-y-2">
				{clubs.map((c) => (
					<li
						key={c.id}
						className="border border-border rounded-md px-3 py-2 bg-bg-surface"
					>
						<div className="font-medium text-text-primary">{c.name}</div>
						<div className="text-micro text-text-secondary mt-0.5">
							{c.locationCity ?? "—"} · Owner: {c.ownerName ?? "—"} · Status:{" "}
							{c.status} · Created {new Date(c.createdAt).toLocaleDateString()}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
