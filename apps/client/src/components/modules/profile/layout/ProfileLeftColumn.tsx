"use client";

import { CurrentGearCard } from "@/components/modules/profile/CurrentGearCard/CurrentGearCard";
import { ProfileLeftColumnSkeleton } from "@/components/modules/profile/layout/ProfileLeftColumnSkeleton/ProfileLeftColumnSkeleton";
import { PlayerHeaderCard } from "@/components/modules/profile/PlayerHeaderCard/PlayerHeaderCard";
import { PlayStyleCard } from "@/components/modules/profile/PlayStyleCard/PlayStyleCard";
import { useProfile } from "@/hooks/useProfile/client";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {
	type ProfileViewUser,
	publicProfileDtoToViewUser,
} from "@/types/profile-view-user";

interface ProfileLeftColumnProps {
	userId?: string;
}
export function ProfileLeftColumn({ userId }: ProfileLeftColumnProps) {
	const { user } = useAppSelector((s) => s.auth);
	const { data: remoteProfile, isPending, isError } = useProfile(userId);

	let player: ProfileViewUser | null = null;
	if (userId) {
		if (remoteProfile) player = publicProfileDtoToViewUser(remoteProfile);
	} else if (user) {
		player = user;
	}

	if (userId && isPending) {
		return (
			<div
				className={cn("@container/profile-left-column", "lg:w-[35%] shrink-0")}
			>
				<ProfileLeftColumnSkeleton />
			</div>
		);
	}

	if (!player || (userId && isError)) return null;

	return (
		<div
			className={cn("@container/profile-left-column", "lg:w-[35%] shrink-0")}
		>
			<div className="lg:sticky lg:top-24 space-y-6">
				<PlayerHeaderCard user={player} />
				<PlayStyleCard user={player} />
				<CurrentGearCard user={player} />
			</div>
		</div>
	);
}
