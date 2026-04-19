import { PrivacyPolicyContent } from "@rotra/legal-content";
import type { Metadata } from "next";

import { LandingFooter } from "@/components/coming-soon/LandingFooter/LandingFooter";
import { LandingNav } from "@/components/coming-soon/LandingNav/LandingNav";

export const metadata: Metadata = {
	title: "Privacy Policy — ROTRA",
	description:
		"How ROTRA collects, uses, and shares information when you use our services.",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-bg-base pb-[calc(5rem+env(safe-area-inset-bottom,0px))] text-text-primary md:pb-0">
			<LandingNav />
			<main className="mx-auto max-w-[480px] px-4 pb-16 pt-28 md:px-6 md:pt-32">
				<PrivacyPolicyContent />
			</main>
			<LandingFooter />
		</div>
	);
}
