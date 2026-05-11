"use client";

import {
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useState,
} from "react";

import { cn } from "@/lib/utils/tailwind";

import {
	type CountCardShellVariants,
	type CountCardValueVariants,
	countCardShellVariants,
	countCardValueVariants,
} from "./CountCard.variants";

const COUNT_ANIMATION_DURATION_MS = 500;

function easeOutCubic(progress: number): number {
	return 1 - (1 - progress) ** 3;
}

export type CountCardProps = HTMLAttributes<HTMLDivElement> &
	CountCardShellVariants &
	CountCardValueVariants & {
		title: string;
		count: number | string;
		animateCount?: boolean;
		subLabel?: ReactNode;
	};

export function CountCard({
	className,
	title,
	count,
	layout,
	tone,
	subLabel,
	animateCount = false,
	...props
}: CountCardProps) {
	const isNumericCount = typeof count === "number";
	const [displayCount, setDisplayCount] = useState(() =>
		animateCount && isNumericCount && count > 0 ? 0 : count,
	);

	useEffect(() => {
		if (!isNumericCount || !animateCount || count <= 0) {
			setDisplayCount(count);
			return;
		}

		const start = performance.now();
		let frameId = 0;

		const tick = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / COUNT_ANIMATION_DURATION_MS, 1);
			const easedProgress = easeOutCubic(progress);
			setDisplayCount(Math.round(count * easedProgress));

			if (progress < 1) {
				frameId = requestAnimationFrame(tick);
			}
		};

		frameId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frameId);
		};
	}, [animateCount, count, isNumericCount]);

	return (
		<div
			className={cn(countCardShellVariants({ layout }), className)}
			{...props}
		>
			<p className="text-label uppercase text-text-secondary">{title}</p>
			<p className={countCardValueVariants({ layout, tone })}>{displayCount}</p>
			{subLabel ? (
				<div className={cn(layout === "attention" ? "mt-2" : "mt-1")}>
					{subLabel}
				</div>
			) : null}
		</div>
	);
}

CountCard.displayName = "CountCard";
