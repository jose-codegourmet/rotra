import { DashboardLayout } from "@/app/layouts/DashboardLayout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<DashboardLayout pageTitle="Dashboard" activeItem="home">
			{children}
		</DashboardLayout>
	);
}
