import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import {
	AdminSessionError,
	requireAdminSession,
} from "@/lib/auth/admin-session";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		await requireAdminSession();
	} catch (error) {
		if (error instanceof AdminSessionError) {
			if (error.status === 401) {
				redirect("/login");
			}
			const message = error.message.toLowerCase();
			if (message.includes("profile")) {
				redirect("/login?error=admin_profile_missing");
			}
			if (message.includes("role")) {
				redirect("/login?error=admin_role_missing");
			}
			if (message.includes("inactive")) {
				redirect("/login?error=admin_inactive");
			}
			redirect("/login?error=forbidden");
		}
		redirect("/login?error=auth_unavailable");
	}

	return <AdminShell>{children}</AdminShell>;
}
