import type { Metadata } from "next";
import { SessionSetupForm } from "@/components/modules/session/session-setup-form/SessionSetupForm";

export const metadata: Metadata = {
	title: "ROTRA — Session setup",
	description:
		"Set location, clock, courts, and format for tonight’s tester queue.",
};

export default function NewSessionPage() {
	return <SessionSetupForm />;
}
