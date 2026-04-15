"use client";

import type { ReactNode } from "react";

type StepBlockProps = {
	kicker: string;
	title: string;
	subtitle: string;
	children: ReactNode;
};

export function StepBlock({
	kicker,
	title,
	subtitle,
	children,
}: StepBlockProps) {
	return (
		<div className="flex flex-col gap-4">
			<p className="text-small text-text-secondary">{kicker}</p>
			<h2 className="text-xl font-semibold tracking-tight text-text-primary">
				{title}
			</h2>
			<p className="text-body text-text-secondary">{subtitle}</p>
			{children}
		</div>
	);
}
