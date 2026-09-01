import type { Metadata } from "next";
import { SubmitConfirmView } from "@/components/modules/submit-confirm/SubmitConfirmView";

export const metadata: Metadata = {
	title: "ROTRA — Submit match",
	description: "Confirm and lock the match score.",
};

export default function SubmitPage() {
	return <SubmitConfirmView />;
}
