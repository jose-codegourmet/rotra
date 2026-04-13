import { AdminUsersTable } from "@/components/rotra/AdminUsersTable/AdminUsersTable";
import { MOCK_ADMIN_USERS } from "@/constants/mock-admin-users";

export default function UsersPage() {
	return (
		<div className="mx-auto max-w-6xl space-y-4">
			<p className="text-body text-text-secondary">
				Platform admin accounts (mock data). Filter by active or inactive, or
				search by name or email.
			</p>
			<AdminUsersTable data={MOCK_ADMIN_USERS} />
		</div>
	);
}
