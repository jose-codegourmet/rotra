"use client";

import { LayoutGrid, List, Map } from "lucide-react";
import { viewToggleTabVariants } from "@/components/modules/dashboard/view-toggle/ViewToggle.variants";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardViewMode } from "@/store/slices/uiSlice";
import type { DashboardViewMode } from "@/types/session-discovery";

const TABS: Array<{
	mode: DashboardViewMode;
	label: string;
	Icon: typeof Map;
}> = [
	{ mode: "map", label: "Map View", Icon: Map },
	{ mode: "list", label: "List", Icon: List },
	{ mode: "grid", label: "Grid", Icon: LayoutGrid },
];

export function ViewToggle() {
	const dispatch = useAppDispatch();
	const activeMode = useAppSelector((s) => s.ui.dashboardViewMode);

	return (
		<div className="pointer-events-auto absolute top-4 right-4 z-30">
			<div className="flex rounded-xl border border-outline-variant/10 bg-bg-base/80 p-1.5 shadow-lg backdrop-blur-md">
				{TABS.map(({ mode, label, Icon }) => {
					const isActive = activeMode === mode;
					return (
						<button
							key={mode}
							type="button"
							onClick={() => dispatch(setDashboardViewMode(mode))}
							className={cn(viewToggleTabVariants({ active: isActive }))}
						>
							<Icon size={14} fill={isActive ? "currentColor" : "none"} />
							<span>{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
