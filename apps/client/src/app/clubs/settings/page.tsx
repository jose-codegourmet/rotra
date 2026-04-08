import {
	Bell,
	ChevronRight,
	Link,
	Lock,
	Shield,
	Trash2,
	Users,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Club Settings — ROTRA",
	description: "Manage your club settings.",
};

const SETTINGS_SECTIONS = [
	{
		title: "General",
		items: [
			{
				icon: Shield,
				label: "Club Details",
				description: "Name, location, description",
				href: "#",
			},
			{
				icon: Lock,
				label: "Privacy & Visibility",
				description: "Public or private club",
				href: "#",
			},
		],
	},
	{
		title: "Membership",
		items: [
			{
				icon: Users,
				label: "Member Management",
				description: "Approve, remove, and manage roles",
				href: "#",
			},
			{
				icon: Lock,
				label: "Join Requests",
				description: "Auto-approve or manual review",
				href: "#",
			},
			{
				icon: Link,
				label: "Invite Links",
				description: "Create and manage invite links",
				href: "#",
			},
		],
	},
	{
		title: "Notifications",
		items: [
			{
				icon: Bell,
				label: "Club Notifications",
				description: "Session alerts and announcements",
				href: "#",
			},
		],
	},
];

export default function ClubSettingsPage() {
	return (
		<div className="max-w-[800px] mx-auto p-4 md:p-8">
			<div className="flex flex-col gap-6">
				{/* Page header */}
				<div>
					<p className="text-micro font-bold uppercase tracking-widest text-accent mb-1">
						Club
					</p>
					<h1 className="text-display font-bold text-text-primary tracking-tight">
						Club Settings
					</h1>
					<p className="text-body text-text-secondary mt-2">
						Manage settings for Sunrise Badminton Club.
					</p>
				</div>

				{/* Settings sections */}
				{SETTINGS_SECTIONS.map((section) => (
					<div key={section.title} className="flex flex-col gap-2">
						<p className="text-small font-bold uppercase tracking-widest text-text-secondary px-1">
							{section.title}
						</p>
						<div className="bg-bg-surface border border-border rounded-lg overflow-hidden shadow-card">
							{section.items.map((item, idx) => {
								const Icon = item.icon;
								return (
									<a
										key={item.label}
										href={item.href}
										className={`flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated transition-colors duration-default ${
											idx < section.items.length - 1
												? "border-b border-border"
												: ""
										}`}
									>
										<div className="size-9 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
											<Icon
												size={18}
												strokeWidth={1.5}
												className="text-text-secondary"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-body font-medium text-text-primary">
												{item.label}
											</p>
											<p className="text-small text-text-secondary">
												{item.description}
											</p>
										</div>
										<ChevronRight
											size={16}
											strokeWidth={1.5}
											className="text-text-disabled shrink-0"
										/>
									</a>
								);
							})}
						</div>
					</div>
				))}

				{/* Danger zone */}
				<div className="flex flex-col gap-2">
					<p className="text-small font-bold uppercase tracking-widest text-text-secondary px-1">
						Danger Zone
					</p>
					<div className="bg-bg-surface border border-border rounded-lg p-5 shadow-card flex flex-col gap-4">
						<div className="flex items-center justify-between gap-4">
							<div>
								<p className="text-body font-medium text-text-primary">
									Dissolve Club
								</p>
								<p className="text-small text-text-secondary">
									Permanently delete this club and all its data. This cannot be
									undone.
								</p>
							</div>
							<button
								type="button"
								className="shrink-0 flex items-center gap-2 h-9 px-4 text-small font-bold uppercase tracking-widest text-error border border-error/40 rounded-md hover:bg-error/10 transition-colors duration-default"
							>
								<Trash2 size={14} strokeWidth={1.5} />
								<span className="hidden sm:inline">Dissolve</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
