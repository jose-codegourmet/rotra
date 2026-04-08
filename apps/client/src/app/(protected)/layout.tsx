import { DashboardLayout } from "@/layouts/DashboardLayout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <DashboardLayout pageTitle="Dashboard">{children}</DashboardLayout>;
}
