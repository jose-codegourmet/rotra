import type { User } from "@supabase/supabase-js";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	avatarUrlFromAuthUser,
	displayNameFromAuthUser,
} from "@/lib/auth/supabase-user-display";
import { cn } from "@/lib/utils";

export interface SmallUserCardProps {
	user: User;
	isOwner: boolean;
	loading?: boolean;
	isMobile?: boolean;
	onAvatarClick?: () => void;
}

export function SmallUserCard({
	user,
	isOwner,
	isMobile,
	onAvatarClick,
}: SmallUserCardProps) {
	const profileURL = isOwner ? `/profile` : `/profile/${user.id}`;
	const avatarUrl = user ? avatarUrlFromAuthUser(user) : null;

	return (
		<div
			className={cn(
				"small-user-card",
				"w-auto flex items-center justify-start gap-1",
			)}
		>
			<Link
				href={profileURL}
				className="flex min-w-0  items-center gap-3"
				{...(onAvatarClick ? { onClick: onAvatarClick } : {})}
			>
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
			</Link>

			<div
				className={cn(
					"flex-col overflow-hidden flex-1 text-left",
					isMobile ? "flex" : "hidden lg:flex",
				)}
			>
				<span className="text-small font-black text-text-primary uppercase tracking-wider truncate">
					{displayNameFromAuthUser({ user })}
				</span>
				<span className="text-xs font-bold text-accent uppercase tracking-wider truncate">
					IRON 3
				</span>
			</div>
		</div>
	);
}
