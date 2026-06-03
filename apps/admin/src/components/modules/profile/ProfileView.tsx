"use client";

import type { AdminRole } from "@prisma/client";
import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { ChangeAdminPasswordForm } from "@/components/modules/profile/change-admin-password-form/ChangeAdminPasswordForm";
import { DeleteAdminAccountSection } from "@/components/modules/profile/delete-admin-account-section/DeleteAdminAccountSection";
import { UpdateAdminNameForm } from "@/components/modules/profile/update-admin-name-form/UpdateAdminNameForm";

export type ProfileViewProps = {
	profileId: string;
	name: string;
	email: string;
	adminRole: AdminRole;
};

function formatAdminRole(role: AdminRole): string {
	return role === "super_admin" ? "Super Admin" : "Platform Admin";
}

export function ProfileView({ name, email, adminRole }: ProfileViewProps) {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
			<div>
				<p className="text-small text-text-secondary">
					Role: {formatAdminRole(adminRole)}
				</p>
			</div>

			<PageSection
				title="Profile information"
				description="Update your display name. Email is managed by your account and cannot be changed here."
			>
				<div className="rounded-lg border border-border bg-bg-surface p-5">
					<UpdateAdminNameForm
						key={name}
						name={name}
						email={email}
						onSuccess={() => undefined}
						onError={() => undefined}
					/>
				</div>
			</PageSection>

			<PageSection
				title="Password"
				description="Choose a new password for your admin account."
			>
				<div className="rounded-lg border border-border bg-bg-surface p-5">
					<ChangeAdminPasswordForm
						onSuccess={() => undefined}
						onError={() => undefined}
					/>
				</div>
			</PageSection>

			<PageSection
				title="Account deletion"
				description="Remove your admin account from the platform."
			>
				<DeleteAdminAccountSection email={email} adminRole={adminRole} />
			</PageSection>
		</div>
	);
}

ProfileView.displayName = "ProfileView";
