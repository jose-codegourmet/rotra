import type { AdminRole } from "@prisma/client";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { useLogoutDialog } from "@/hooks/logoutDialogProvider";
import type { CurrentProfileDisplay } from "@/lib/server/current-profile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileDrawer } from "@/store/slices/uiSlice";
import { SmallAdminUserCard } from "../small-admin-user-card/SmallAdminUserCard";
import { SmallUserCard } from "../small-user-card/SmallUserCard";

interface MobileDrawerUserSectionProps {
	adminRole?: AdminRole | null;
	currentProfile?: CurrentProfileDisplay | null;
}
export function MobileDrawerUserSection({
	adminRole = null,
	currentProfile = null,
}: MobileDrawerUserSectionProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((s) => s.auth.user);
	const initialized = useAppSelector((s) => s.auth.initialized);
	const loading = !initialized;
	const { openDialog: openLogoutDialog } = useLogoutDialog();

	if (!user) return null;

	return (
		<div className="p-6 border-t border-border bg-bg-base">
			<div className="flex items-center gap-3 p-3 bg-bg-surface rounded-lg border border-border/30">
				{adminRole ? (
					<SmallAdminUserCard
						user={user}
						adminRole={adminRole}
						currentProfile={currentProfile}
						isMobile
						onAvatarClick={() => dispatch(closeMobileDrawer())}
					/>
				) : (
					<SmallUserCard
						user={user}
						isOwner={true}
						currentProfile={currentProfile}
						loading={loading}
						isMobile
						onAvatarClick={() => dispatch(closeMobileDrawer())}
					/>
				)}

				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Open account options"
					className="ml-auto shrink-0 text-text-disabled"
					onClick={() => {
						dispatch(closeMobileDrawer());
						openLogoutDialog();
					}}
				>
					<LogOutIcon size={16} strokeWidth={1.5} />
				</Button>
			</div>
		</div>
	);
}
