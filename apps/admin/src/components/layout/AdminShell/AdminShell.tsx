"use client";

import type { AdminRole } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DesktopNavbarHeader } from "@/components/modules/admin-shell/desktop-navbar-header/DesktopNavbarHeader";
import { DesktopSidebar } from "@/components/modules/admin-shell/desktop-sidebar/DesktopSidebar";
import { MobileNavBackdrop } from "@/components/modules/admin-shell/mobile-nav-backdrop/MobileNavBackdrop";
import { MobileNavbarHeader } from "@/components/modules/admin-shell/mobile-navbar-header/MobileNavbarHeader";
import { MobileSidebar } from "@/components/modules/admin-shell/mobile-sidebar/MobileSidebar";
import { SignOutDialog } from "@/components/modules/admin-shell/sign-out-dialog/SignOutDialog";
import { getAdminShellPageTitle, ROUTES } from "@/constants/admin";
import { useAdminNotificationsQuery } from "@/hooks/useAdminNotifications/client";
import { adaptAdminNotificationToUiItem } from "@/hooks/useAdminNotifications/server";
import { createClient } from "@/lib/supabase/client";

export interface AdminShellProps {
	children: React.ReactNode;
	/** When set (e.g. Storybook), overrides the title derived from the URL. */
	pageTitle?: string;
	adminRole?: AdminRole;
	adminName?: string;
}

export function AdminShell({
	children,
	pageTitle: pageTitleOverride,
	adminRole = "admin",
	adminName,
}: AdminShellProps) {
	const pathname = usePathname();
	const derivedTitle = getAdminShellPageTitle(pathname);
	const pageTitle = pageTitleOverride ?? derivedTitle;
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
	const [signOutPending, setSignOutPending] = useState(false);
	const [signOutError, setSignOutError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);
	const { data: notificationsData } = useAdminNotificationsQuery(
		{ page: 1, limit: 5 },
		{ refetchInterval: 30_000 },
	);
	const shellNotifications =
		notificationsData?.rows.map((row) => adaptAdminNotificationToUiItem(row)) ??
		[];
	const notificationUnreadCount = notificationsData?.unreadCount ?? 0;

	function openSignOutDialog() {
		setMobileNavOpen(false);
		setSignOutError(null);
		setSignOutDialogOpen(true);
	}

	async function handleConfirmSignOut() {
		setSignOutPending(true);
		setSignOutError(null);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			setSignOutDialogOpen(false);
			router.replace(ROUTES.LOGIN);
			router.refresh();
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Unable to sign out right now. Please try again.";
			setSignOutError(message);
		} finally {
			setSignOutPending(false);
		}
	}

	return (
		<div className="min-h-screen bg-bg-base">
			<DesktopSidebar pathname={pathname} adminRole={adminRole} />

			<MobileNavBackdrop
				open={mobileNavOpen}
				onDismiss={() => setMobileNavOpen(false)}
			/>

			<MobileSidebar
				open={mobileNavOpen}
				pathname={pathname}
				adminRole={adminRole}
				{...(adminName !== undefined ? { adminName } : {})}
				unreadCount={notificationUnreadCount}
				onClose={() => setMobileNavOpen(false)}
				onRequestSignOut={openSignOutDialog}
			/>

			<MobileNavbarHeader
				pageTitle={pageTitle}
				onOpenMenu={() => setMobileNavOpen(true)}
			/>

			<div className="flex min-h-screen flex-col pt-16 md:ml-20 md:pt-0 lg:ml-64">
				<DesktopNavbarHeader
					pageTitle={pageTitle}
					{...(adminName !== undefined ? { adminName } : {})}
					onRequestSignOut={openSignOutDialog}
					notifications={shellNotifications}
					unreadCount={notificationUnreadCount}
				/>
				<main className="flex-1 p-4 md:p-6">{children}</main>
			</div>

			<SignOutDialog
				open={signOutDialogOpen}
				onOpenChange={(open) => {
					setSignOutDialogOpen(open);
					if (!open) setSignOutError(null);
				}}
				pending={signOutPending}
				error={signOutError}
				onCancel={() => {
					setSignOutError(null);
					setSignOutDialogOpen(false);
				}}
				onConfirm={handleConfirmSignOut}
			/>
		</div>
	);
}

AdminShell.displayName = "AdminShell";
