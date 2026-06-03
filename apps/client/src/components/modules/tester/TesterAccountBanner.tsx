"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "rotra_tester_banner_dismissed";

export function TesterAccountBanner() {
	const [dismissed, setDismissed] = useState(() => {
		if (typeof window === "undefined") return false;
		return sessionStorage.getItem(DISMISS_KEY) === "1";
	});

	if (dismissed) return null;

	return (
		<div
			className={cn(
				"mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100",
			)}
			role="status"
		>
			<span>You are signed in as a test account.</span>
			<button
				type="button"
				className="shrink-0 rounded p-1 hover:bg-amber-500/20"
				aria-label="Dismiss"
				onClick={() => {
					sessionStorage.setItem(DISMISS_KEY, "1");
					setDismissed(true);
				}}
			>
				<X className="size-4" aria-hidden />
			</button>
		</div>
	);
}
