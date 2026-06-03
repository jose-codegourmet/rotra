import { ProfileView } from "@/components/modules/profile/ProfileView";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function ProfilePage() {
	const session = await requireAdminSession();

	return (
		<ProfileView
			profileId={session.profileId}
			name={session.name}
			email={session.email}
			adminRole={session.adminRole}
		/>
	);
}
