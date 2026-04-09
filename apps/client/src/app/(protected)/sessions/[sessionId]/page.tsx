import type { Metadata } from "next";

import { SessionLiveTabs } from "@/components/modules/session";

export const metadata: Metadata = {
	title: "Session — ROTRA",
	description: "Live queue, standings, and session dashboard.",
};

export default function SessionLivePage() {
	return (
		<div className="max-w-[1100px] mx-auto p-4 md:p-8">
			<SessionLiveTabs sessionLabel="Live session" />
		</div>
	);
}
