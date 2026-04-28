import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell/AdminShell";
import { requireAdminSession } from "@/lib/auth/admin-session";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	try {
		await requireAdminSession();
	} catch {
		redirect("/login");
	}

	return <AdminShell>{children}</AdminShell>;
}
