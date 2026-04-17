"use client";

import { useEffect, useState } from "react";

import DarkVeil from "@/components/ui/dark-veil/DarkVeil";

function usePrefersReducedMotion() {
	const [reduce, setReduce] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduce(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return reduce;
}

/** Subtle atmospheric layer; omitted when user prefers reduced motion. */
export function HeroVeil() {
	const reduceMotion = usePrefersReducedMotion();
	if (reduceMotion) {
		return null;
	}
	return (
		<div className="pointer-events-none absolute inset-0 z-[1] opacity-40">
			<DarkVeil
				hueShift={78}
				noiseIntensity={0}
				scanlineIntensity={0}
				speed={0.35}
				scanlineFrequency={0}
				warpAmount={0}
				resolutionScale={1}
			/>
		</div>
	);
}
