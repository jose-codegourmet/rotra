import { ArchitectureGrid } from "@/components/coming-soon/ArchitectureGrid/ArchitectureGrid";
import { CommunityBand } from "@/components/coming-soon/CommunityBand/CommunityBand";
import { HeroSection } from "@/components/coming-soon/HeroSection/HeroSection";
import { LandingFooter } from "@/components/coming-soon/LandingFooter/LandingFooter";
import { LandingNav } from "@/components/coming-soon/LandingNav/LandingNav";
import { SecondaryCta } from "@/components/coming-soon/SecondaryCta/SecondaryCta";
import { WaitlistSection } from "@/components/coming-soon/WaitlistSection/WaitlistSection";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-bg-base text-text-primary">
			<LandingNav />
			<main>
				<HeroSection />
				<WaitlistSection />
				<ArchitectureGrid />
				<CommunityBand />
				<SecondaryCta />
				<LandingFooter />
			</main>
		</div>
	);
}
