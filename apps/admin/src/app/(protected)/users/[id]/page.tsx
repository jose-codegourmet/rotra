import { db, getAdminUserDetail } from "@rotra/db";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { ROUTES } from "@/constants/admin";
import { cn } from "@/lib/utils";

type PageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const user = await db.profile.findUnique({
		where: { id },
		select: { id: true, name: true, adminRole: true },
	});
	return {
		title: user?.adminRole
			? `${user.name} — ROTRA Admin`
			: "User — ROTRA Admin",
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

function roleLabel(role: "admin" | "super_admin") {
	return role === "super_admin" ? "Super admin" : "Admin";
}

function statusLabel(status: "invited" | "active" | "inactive") {
	return status === "invited"
		? "Invited"
		: status === "active"
			? "Active"
			: "Inactive";
}

function StatusBadge({
	status,
}: {
	status: "invited" | "active" | "inactive";
}) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-0.5 text-micro font-bold uppercase tracking-widest",
				status === "active"
					? "border border-accent/40 bg-accent-subtle text-accent"
					: "border border-border bg-bg-elevated text-text-secondary",
			)}
		>
			{statusLabel(status)}
		</span>
	);
}

function displayDate(value: Date | null): string {
	return value ? value.toLocaleString() : "Never";
}

export default async function AdminUserDetailPage({ params }: PageProps) {
	const { id } = await params;
	let detail: Awaited<ReturnType<typeof getAdminUserDetail>>;
	try {
		detail = await getAdminUserDetail(db, id);
	} catch {
		notFound();
	}
	const user = detail.user;

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
				description="Admin profile detail and audit activity."
			>
				<dl className="space-y-4 rounded-lg border border-border bg-bg-surface p-6">
					<DetailField label="User ID" value={user.id} />
					<DetailField label="Email" value={user.email} />
					<DetailField label="Role" value={roleLabel(user.adminRole)} />
					<div className="grid gap-1 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
						<dt className="text-label uppercase text-text-secondary">Status</dt>
						<dd>
							<StatusBadge status={user.status} />
						</dd>
					</div>
					<DetailField
						label="Last active"
						value={displayDate(
							user.lastActiveAt ? new Date(user.lastActiveAt) : null,
						)}
					/>
				</dl>
			</PageSection>

			<PageSection
				title="Activity by this admin"
				description="Recent actions performed by this account."
			>
				<div className="rounded-lg border border-border bg-bg-surface">
					{detail.activityByThisAdmin.length === 0 ? (
						<p className="px-6 py-4 text-small text-text-secondary">
							No recorded actions.
						</p>
					) : (
						<ul className="divide-y divide-border">
							{detail.activityByThisAdmin.map((row) => (
								<li key={row.id} className="px-6 py-4 text-small">
									<p className="text-text-primary">{row.action}</p>
									<p className="text-text-secondary">
										{new Date(row.createdAt).toLocaleString()}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</PageSection>

			<PageSection
				title="Activity on this admin"
				description="Recent actions performed on this account."
			>
				<div className="rounded-lg border border-border bg-bg-surface">
					{detail.activityOnThisAdmin.length === 0 ? (
						<p className="px-6 py-4 text-small text-text-secondary">
							No recorded actions.
						</p>
					) : (
						<ul className="divide-y divide-border">
							{detail.activityOnThisAdmin.map((row) => (
								<li key={row.id} className="px-6 py-4 text-small">
									<p className="text-text-primary">
										{row.action} by {row.admin.name}
									</p>
									<p className="text-text-secondary">
										{new Date(row.createdAt).toLocaleString()}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</PageSection>
		</div>
	);
}
