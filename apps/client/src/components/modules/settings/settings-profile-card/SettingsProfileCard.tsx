"use client";

import Link from "next/link";

import { displayNameFromAuthUser } from "@/lib/auth/supabase-user-display";
import { useAppSelector } from "@/store/hooks";

function initialsFromDisplayName(name: string): string {
	if (name === "…") return "…";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) {
		const word = parts[0];
		if (word.length >= 2) {
			return (word[0] + word[word.length - 1]).toUpperCase();
		}
		return word[0]?.toUpperCase() ?? "?";
	}
	const first = parts[0][0];
	const last = parts[parts.length - 1][0];
	return `${first}${last}`.toUpperCase();
}

export function SettingsProfileCard() {
	const user = useAppSelector((s) => s.auth.user);
	const initialized = useAppSelector((s) => s.auth.initialized);

	const displayName = displayNameFromAuthUser({
		user,
		loading: !initialized,
	});
	const initials = initialsFromDisplayName(displayName);
	const email = user?.email ?? (initialized ? "—" : "…");

	return (
		<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex items-center gap-4">
			<div className="size-12 rounded-full bg-bg-elevated border-2 border-border flex items-center justify-center shrink-0">
				<span className="text-body font-black text-text-secondary">
					{initials}
				</span>
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-body font-semibold text-text-primary truncate">
					{displayName}
				</p>
				<p className="text-small text-text-secondary truncate">{email}</p>
			</div>
			<Link
				href="/profile"
				className="text-small font-bold uppercase tracking-widest text-accent shrink-0"
			>
				View Profile
			</Link>
		</div>
	);
}

SettingsProfileCard.displayName = "SettingsProfileCard";
