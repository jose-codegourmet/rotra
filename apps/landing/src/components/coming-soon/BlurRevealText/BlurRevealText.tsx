"use client";

import type { ViewportOptions } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export type BlurRevealSegment = {
	text: string;
	className?: string;
};

type WordItem = { word: string; className?: string };

type BlurRevealTextProps = {
	children?: string;
	segments?: BlurRevealSegment[];
	className?: string;
	/** Outer wrapper display — use `inline` inside headings so layout stays natural */
	display?: "inline" | "block";
	viewport?: Pick<ViewportOptions, "once" | "amount" | "margin">;
};

function splitWords(text: string): string[] {
	return text.trim().split(/\s+/).filter(Boolean);
}

function flattenSegments(segments: BlurRevealSegment[]): WordItem[] {
	const out: WordItem[] = [];
	for (const seg of segments) {
		const words = splitWords(seg.text);
		for (const word of words) {
			const item: WordItem = { word };
			if (seg.className) {
				item.className = seg.className;
			}
			out.push(item);
		}
	}
	return out;
}

const containerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.07,
			delayChildren: 0.04,
		},
	},
};

const wordVariants = {
	hidden: { opacity: 0, filter: "blur(12px)" },
	visible: {
		opacity: 1,
		filter: "blur(0px)",
		transition: {
			duration: 0.48,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	},
};

export function BlurRevealText({
	children,
	segments,
	className,
	display = "inline",
	viewport,
}: BlurRevealTextProps) {
	const prefersReducedMotion = useReducedMotion();

	const flat: WordItem[] =
		segments && segments.length > 0
			? flattenSegments(segments)
			: typeof children === "string"
				? splitWords(children).map((word): WordItem => ({ word }))
				: [];

	if (segments && segments.length > 0 && typeof children === "string") {
		throw new Error(
			"BlurRevealText: pass either `segments` or `children`, not both.",
		);
	}

	if (flat.length === 0) {
		return null;
	}

	const vp: ViewportOptions = {
		once: true,
		amount: 0.28,
		...viewport,
	};

	if (prefersReducedMotion) {
		if (segments && segments.length > 0) {
			return (
				<span className={className}>
					{segments.map((seg, i) => (
						<span key={`${seg.text}-${i}`} className={seg.className}>
							{i > 0 ? " " : ""}
							{seg.text}
						</span>
					))}
				</span>
			);
		}
		return <span className={className}>{children}</span>;
	}

	return (
		<motion.span
			className={cn(
				display === "block"
					? "flex flex-wrap gap-x-2 gap-y-1"
					: "inline-flex flex-wrap gap-x-2 gap-y-1",
				className,
			)}
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={vp}
		>
			{flat.map((item, index) => (
				<motion.span
					key={`w-${index}-${item.word}`}
					className={cn("inline-block", item.className)}
					variants={wordVariants}
				>
					{item.word}
				</motion.span>
			))}
		</motion.span>
	);
}
