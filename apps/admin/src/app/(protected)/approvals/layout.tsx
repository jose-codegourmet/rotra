import { ApprovalsTabs } from "@/components/modules/club-applications/ApprovalsTabs";

export default function ApprovalsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
			<ApprovalsTabs />
			{children}
		</div>
	);
}
