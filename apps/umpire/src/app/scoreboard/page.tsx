import type { Metadata } from "next";
import { LiveScoreView } from "@/components/modules/live-score/LiveScoreView";

export const metadata: Metadata = {
	title: "ROTRA — Live score",
	description: "Live match scoring.",
};

export default function ScoreboardPage() {
	return <LiveScoreView />;
}
