"use client";

import type { User as AuthUser } from "@supabase/supabase-js";
import {
	LogOut,
	MoreVertical,
	UserCircle,
	User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function displayNameFromUser(user: AuthUser): string {
	const meta = user.user_metadata as Record<string, unknown>;
	const full = meta.full_name ?? meta.name;
	if (typeof full === "string" && full.trim()) {
		return full.trim();
	}
	if (user.email) {
		return user.email;
	}
	return "Player";
}

function avatarUrlFromUser(user: AuthUser): string | null {
	const meta = user.user_metadata as Record<string, unknown>;
	const avatar = meta.avatar_url ?? meta.picture;
	if (typeof avatar === "string" && avatar.startsWith("http")) {
		return avatar;
	}
	if (
		avatar &&
		typeof avatar === "object" &&
		avatar !== null &&
		"url" in avatar &&
		typeof (avatar as { url: string }).url === "string"
	) {
		const u = (avatar as { url: string }).url;
		return u.startsWith("http") ? u : null;
	}
	return null;
}

export function SidebarUserMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const supabase = useMemo(() => createClient(), []);

	useEffect(() => {
		let cancelled = false;

		async function loadUser() {
			const { data } = await supabase.auth.getUser();
			if (!cancelled) {
				setUser(data.user ?? null);
				setLoading(false);
			}
		}

		void loadUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!cancelled) {
				setUser(session?.user ?? null);
			}
		});

		return () => {
			cancelled = true;
			subscription.unsubscribe();
		};
	}, [supabase]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const displayName = loading
		? "…"
		: user
			? displayNameFromUser(user)
			: "Player";
	const avatarUrl = user ? avatarUrlFromUser(user) : null;
	const profileHref = user ? `/profile/${user.id}` : "/profile";

	async function handleSignOut() {
		setIsOpen(false);
		await supabase.auth.signOut();
		window.location.href = "/login";
	}

	return (
		<div
			className="mt-auto pt-6 border-t border-border px-4"
			ref={containerRef}
		>
			<div className="relative">
				{/* Popup menu */}
				{isOpen && (
					<div className="absolute bottom-full left-0 mb-2 w-full bg-bg-surface border border-border rounded-lg shadow-modal overflow-hidden z-10">
						<Link
							href={profileHref}
							onClick={() => setIsOpen(false)}
							className="flex items-center gap-3 px-4 min-h-[44px] text-small font-bold text-text-primary hover:bg-bg-elevated transition-colors duration-default uppercase tracking-widest"
						>
							<UserCircle
								size={16}
								strokeWidth={1.5}
								className="shrink-0 text-text-secondary"
							/>
							Profile
						</Link>
						<div className="h-px bg-border" />
						<button
							type="button"
							className="w-full flex items-center gap-3 px-4 min-h-[44px] text-small font-bold text-error hover:bg-bg-elevated transition-colors duration-default uppercase tracking-widest"
							onClick={() => {
								void handleSignOut();
							}}
						>
							<LogOut size={16} strokeWidth={1.5} className="shrink-0" />
							Log Out
						</button>
					</div>
				)}

				{/* User row trigger */}
				<button
					type="button"
					aria-label="Open user menu"
					aria-expanded={isOpen}
					onClick={() => setIsOpen((prev) => !prev)}
					className="w-full flex items-center gap-3 lg:bg-bg-surface lg:p-3 rounded-lg transition-colors duration-default hover:bg-bg-elevated cursor-pointer group min-h-[44px]"
				>
					{/* Avatar */}
					<div className="relative shrink-0">
						<div className="relative w-10 h-10 rounded-full bg-bg-elevated border-2 border-accent overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-default">
							{avatarUrl ? (
								<Image
									src={avatarUrl}
									alt=""
									fill
									className="object-cover"
									sizes="40px"
									unoptimized
								/>
							) : (
								<UserIcon
									size={18}
									strokeWidth={1.5}
									className="text-text-secondary"
								/>
							)}
						</div>
						<div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-bg-base" />
					</div>

					<div className="hidden lg:flex flex-col overflow-hidden flex-1 text-left">
						<span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
							{displayName}
						</span>
					</div>

					<MoreVertical
						size={16}
						strokeWidth={1.5}
						className={cn(
							"hidden lg:block ml-auto text-text-disabled transition-transform duration-default",
							isOpen && "rotate-90",
						)}
					/>
				</button>
			</div>
		</div>
	);
}
