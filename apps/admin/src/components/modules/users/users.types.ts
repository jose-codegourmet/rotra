export type AdminUserRole = "admin" | "super_admin";
export type AdminUserStatus = "invited" | "active" | "inactive";
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

export type AdminUserRow = {
	id: string;
	name: string;
	email: string;
	adminRole: AdminUserRole;
	adminIsActive: boolean;
	adminInvitedAt: string | null;
	adminActivatedAt: string | null;
	adminDeactivatedAt: string | null;
	lastActiveAt: string | null;
	status: AdminUserStatus;
	openInvitationStatus: InvitationStatus | null;
};

export type AdminActor = {
	profileId: string;
	adminRole: AdminUserRole;
};

export type AdminActionTimelineRow = {
	id: string;
	action: string;
	entityType: string;
	entityId: string;
	note: string | null;
	createdAt: string;
	admin: {
		id: string;
		name: string;
		email: string | null;
	};
};

export type AdminUserDetail = {
	user: AdminUserRow;
	activityByThisAdmin: AdminActionTimelineRow[];
	activityOnThisAdmin: AdminActionTimelineRow[];
};
