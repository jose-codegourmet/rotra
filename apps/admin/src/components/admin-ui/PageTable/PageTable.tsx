import { cn } from "@/lib/utils";

export interface PageTableProps {
	children: React.ReactNode;
	className?: string;
	minWidthClassName?: string;
}

export function PageTable({
	children,
	className,
	minWidthClassName = "min-w-[680px]",
}: PageTableProps) {
	return (
		<div
			className={cn(
				"overflow-x-auto rounded-lg border border-border bg-bg-surface",
				className,
			)}
		>
			<table className={cn("w-full text-left text-small", minWidthClassName)}>
				{children}
			</table>
		</div>
	);
}

PageTable.displayName = "PageTable";
