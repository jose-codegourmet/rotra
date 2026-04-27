"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ApprovalsPageLayoutProps = {
	queue: ReactNode;
	detail: ReactNode;
	detailOpen: boolean;
	onCloseDetail?: () => void;
	className?: string;
};

export function ApprovalsPageLayout({
	queue,
	detail,
	detailOpen,
	onCloseDetail,
	className,
}: ApprovalsPageLayoutProps) {
	return (
		<div
			className={cn(
				"grid gap-6 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-start",
				className,
			)}
		>
			<div className="min-w-0 space-y-4">{queue}</div>

			<div className="min-w-0 lg:block hidden">{detail}</div>

			{detailOpen ? (
				<div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-bg-base">
					<div className="flex items-center gap-2 border-b border-border px-3 py-2">
						<button
							type="button"
							className="text-small font-bold text-accent uppercase tracking-widest"
							onClick={onCloseDetail}
						>
							← Back
						</button>
					</div>
					<div className="flex-1 overflow-y-auto p-4">{detail}</div>
				</div>
			) : null}
		</div>
	);
}
