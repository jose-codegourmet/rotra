import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
	title: "Dashboard — ROTRA",
	description: "Discover nearby badminton sessions on the map.",
};

export default function DashboardPage() {
	return <DashboardClient />;
}
