import type { SessionTabId } from "@/constants/mock-session-ui";
import {
	SESSION_TAB_IDS,
	SESSION_TAB_LABELS,
} from "@/constants/mock-session-ui";
import { cn } from "@/lib/utils";

export interface SessionTabNavProps {
	active: SessionTabId;
	onChange: (id: SessionTabId) => void;
	className?: string;
}

export function SessionTabNav({
	active,
	onChange,
	className,
}: SessionTabNavProps) {
	return (
		<div
			className={cn(
				"flex flex-wrap gap-1 p-1 rounded-lg bg-bg-surface border border-border",
				className,
			)}
			role="tablist"
			aria-label="Session views"
		>
			{SESSION_TAB_IDS.map((id) => {
				const isActive = id === active;
				return (
					<button
						key={id}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onChange(id)}
						className={cn(
							"px-4 py-2 rounded-md text-label font-bold uppercase tracking-widest transition-colors duration-default",
							isActive
								? "bg-accent text-bg-base shadow-accent"
								: "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
						)}
					>
						{SESSION_TAB_LABELS[id]}
					</button>
				);
			})}
		</div>
	);
}
