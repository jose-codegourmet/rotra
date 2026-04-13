import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { ROUTES } from "@/constants/admin";
import {
	type AdminUserRow,
	getMockAdminUserById,
} from "@/constants/mock-admin-users";
import { cn } from "@/lib/utils";

type PageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const user = getMockAdminUserById(id);
	return {
		title: user ? `${user.name} — ROTRA Admin` : "User — ROTRA Admin",
	};
}

function DetailField({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
			<dt className="text-label uppercase text-text-secondary">{label}</dt>
			<dd className="text-body text-text-primary">{value}</dd>
		</div>
	);
}

function StatusBadge({ status }: { status: AdminUserRow["status"] }) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				status === "active"
					? "border border-accent/40 bg-accent-subtle text-accent"
					: "border border-border bg-bg-elevated text-text-secondary",
			)}
		>
			{status}
		</span>
	);
}

export default async function AdminUserDetailPage({ params }: PageProps) {
	const { id } = await params;
	const user = getMockAdminUserById(id);
	if (!user) notFound();

	return (
		<div className="mx-auto max-w-6xl space-y-8">
			<div>
				<Link
					href={ROUTES.USERS}
					className="text-small text-accent hover:underline"
				>
					← Back to directory
				</Link>
			</div>

			<PageSection
				title={user.name}
				description="Mock profile — replace with API-backed admin user when available."
			>
				<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
					<DetailField label="User ID" value={user.id} />
					<DetailField label="Email" value={user.email} />
					<DetailField label="Role" value={user.role} />
					<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
						<dt className="text-label uppercase text-text-secondary">Status</dt>
						<dd>
							<StatusBadge status={user.status} />
						</dd>
					</div>
					<DetailField label="Last active" value={user.lastActive} />
				</dl>
			</PageSection>
		</div>
	);
}
