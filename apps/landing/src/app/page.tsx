import { ArchitectureGrid } from "@/components/coming-soon/ArchitectureGrid/ArchitectureGrid";
import { HeroSection } from "@/components/coming-soon/HeroSection/HeroSection";
import { LandingFooter } from "@/components/coming-soon/LandingFooter/LandingFooter";
import { LandingNav } from "@/components/coming-soon/LandingNav/LandingNav";
import { SecondaryCta } from "@/components/coming-soon/SecondaryCta/SecondaryCta";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-bg-base pb-[calc(5rem+env(safe-area-inset-bottom,0px))] text-text-primary md:pb-0">
			<LandingNav />
			<main>
				<HeroSection />
				<ArchitectureGrid />
				<SecondaryCta />
				<LandingFooter />
			</main>
		</div>
	);
}
