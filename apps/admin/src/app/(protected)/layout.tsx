import { AdminShell } from "@/components/layout/AdminShell/AdminShell";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AdminShell>{children}</AdminShell>;
}
