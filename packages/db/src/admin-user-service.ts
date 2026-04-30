import type {
	AdminAction,
	AdminRole,
	InvitationStatus,
	Prisma,
	PrismaClient,
} from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export class AdminUserError extends Error {
	constructor(
		public readonly code:
			| "not_found"
			| "forbidden"
			| "conflict"
			| "bad_input"
			| "bad_state",
		message: string,
	) {
		super(message);
		this.name = "AdminUserError";
	}
}

export type AdminDirectoryStatus = "invited" | "active" | "inactive";

export type AdminDirectoryUser = {
	id: string;
	name: string;
	email: string;
	adminRole: AdminRole;
	adminIsActive: boolean;
	adminInvitedAt: Date | null;
	adminActivatedAt: Date | null;
	adminDeactivatedAt: Date | null;
	lastActiveAt: Date | null;
	status: AdminDirectoryStatus;
	openInvitationStatus: InvitationStatus | null;
};

export type AdminActionTimelineEntry = {
	id: string;
	action: AdminAction;
	entityType: string;
	entityId: string;
	beforeValue: Prisma.JsonValue | null;
	afterValue: Prisma.JsonValue | null;
	note: string | null;
	createdAt: Date;
	admin: {
		id: string;
		name: string;
		email: string | null;
	};
};

export type AdminUserDetail = {
	user: AdminDirectoryUser;
	activityByThisAdmin: AdminActionTimelineEntry[];
	activityOnThisAdmin: AdminActionTimelineEntry[];
};

export type InviteAdminUserInput = {
	actorProfileId: string;
	authUserId: string;
	name: string;
	email: string;
	role: AdminRole;
};

export type InviteAdminUserResult = {
	profileId: string;
	invitationId: string;
};

type MutateGuards = {
	actorProfileId: string;
	targetProfileId: string;
	foundingSuperAdminId?: string | null | undefined;
	requireTargetActive?: boolean;
};

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function profileSnapshot(profile: {
	id: string;
	email: string | null;
	adminRole: AdminRole | null;
	adminIsActive: boolean;
	adminInvitedAt: Date | null;
	adminActivatedAt: Date | null;
	adminDeactivatedAt: Date | null;
}) {
	return {
		id: profile.id,
		email: profile.email,
		adminRole: profile.adminRole,
		adminIsActive: profile.adminIsActive,
		adminInvitedAt: profile.adminInvitedAt,
		adminActivatedAt: profile.adminActivatedAt,
		adminDeactivatedAt: profile.adminDeactivatedAt,
	};
}

async function assertActiveSuperAdmin(tx: DbClient, actorProfileId: string) {
	const actor = await tx.profile.findUnique({
		where: { id: actorProfileId },
		select: {
			id: true,
			adminRole: true,
			adminIsActive: true,
		},
	});
	if (!actor || actor.adminRole !== "super_admin" || !actor.adminIsActive) {
		throw new AdminUserError(
			"forbidden",
			"Only active Super Admins can perform this action.",
		);
	}
}

async function assertTargetMutationAllowed(
	tx: DbClient,
	input: MutateGuards,
): Promise<{
	target: {
		id: string;
		email: string | null;
		adminRole: AdminRole | null;
		adminIsActive: boolean;
		adminInvitedAt: Date | null;
		adminActivatedAt: Date | null;
		adminDeactivatedAt: Date | null;
	};
}> {
	await assertActiveSuperAdmin(tx, input.actorProfileId);

	const target = await tx.profile.findUnique({
		where: { id: input.targetProfileId },
		select: {
			id: true,
			email: true,
			adminRole: true,
			adminIsActive: true,
			adminInvitedAt: true,
			adminActivatedAt: true,
			adminDeactivatedAt: true,
		},
	});
	if (!target?.adminRole) {
		throw new AdminUserError("not_found", "Admin user not found.");
	}

	if (input.requireTargetActive && !target.adminIsActive) {
		throw new AdminUserError("bad_state", "Admin user is not active.");
	}

	if (input.foundingSuperAdminId && target.id === input.foundingSuperAdminId) {
		throw new AdminUserError(
			"forbidden",
			"Founding Super Admin cannot be modified.",
		);
	}

	return { target };
}

async function assertLastActiveSuperAdminGuard(
	tx: DbClient,
	targetProfileId: string,
): Promise<void> {
	const activeSuperAdmins = await tx.profile.count({
		where: {
			adminRole: "super_admin",
			adminIsActive: true,
		},
	});
	const isTargetActiveSuperAdmin = await tx.profile.findFirst({
		where: {
			id: targetProfileId,
			adminRole: "super_admin",
			adminIsActive: true,
		},
		select: { id: true },
	});
	if (isTargetActiveSuperAdmin && activeSuperAdmins <= 1) {
		throw new AdminUserError(
			"forbidden",
			"Cannot leave the platform without an active Super Admin.",
		);
	}
}

export async function listAdminUsers(db: PrismaClient): Promise<AdminDirectoryUser[]> {
	const admins = await db.profile.findMany({
		where: { adminRole: { not: null } },
		select: {
			id: true,
			name: true,
			email: true,
			adminRole: true,
			adminIsActive: true,
			adminInvitedAt: true,
			adminActivatedAt: true,
			adminDeactivatedAt: true,
		},
		orderBy: [{ adminRole: "asc" }, { name: "asc" }],
	});

	const adminIds = admins.map((admin) => admin.id);
	const emails = admins
		.map((admin) => admin.email)
		.filter((email): email is string => Boolean(email));

	const [activityRows, openInvites] = await Promise.all([
		adminIds.length === 0
			? Promise.resolve([])
			: db.adminActionLog.groupBy({
					by: ["adminId"],
					where: { adminId: { in: adminIds } },
					_max: { createdAt: true },
				}),
		emails.length === 0
			? Promise.resolve([])
			: db.adminInvitation.findMany({
					where: {
						email: { in: emails },
						status: { in: ["pending", "expired"] },
					},
					orderBy: { createdAt: "desc" },
					distinct: ["email"],
					select: { email: true, status: true },
				}),
	]);

	const lastActiveMap = new Map<string, Date>();
	for (const row of activityRows) {
		if (row._max.createdAt) {
			lastActiveMap.set(row.adminId, row._max.createdAt);
		}
	}
	const inviteMap = new Map<string, InvitationStatus>();
	for (const row of openInvites) {
		inviteMap.set(normalizeEmail(row.email), row.status);
	}

	const rows: AdminDirectoryUser[] = [];
	for (const admin of admins) {
		if (!admin.adminRole || !admin.email) continue;
		const openInvitationStatus = inviteMap.get(normalizeEmail(admin.email)) ?? null;
		const status: AdminDirectoryStatus = admin.adminIsActive
			? "active"
			: openInvitationStatus
				? "invited"
				: "inactive";
		rows.push({
			id: admin.id,
			name: admin.name,
			email: admin.email,
			adminRole: admin.adminRole,
			adminIsActive: admin.adminIsActive,
			adminInvitedAt: admin.adminInvitedAt,
			adminActivatedAt: admin.adminActivatedAt,
			adminDeactivatedAt: admin.adminDeactivatedAt,
			lastActiveAt: lastActiveMap.get(admin.id) ?? null,
			status,
			openInvitationStatus,
		});
	}
	return rows;
}

export async function getAdminUserDetail(
	db: PrismaClient,
	id: string,
): Promise<AdminUserDetail> {
	const users = await listAdminUsers(db);
	const user = users.find((row) => row.id === id);
	if (!user) throw new AdminUserError("not_found", "Admin user not found.");

	const [activityByThisAdmin, activityOnThisAdmin] = await Promise.all([
		db.adminActionLog.findMany({
			where: { adminId: id },
			orderBy: { createdAt: "desc" },
			take: 100,
			select: {
				id: true,
				action: true,
				entityType: true,
				entityId: true,
				beforeValue: true,
				afterValue: true,
				note: true,
				createdAt: true,
				admin: {
					select: { id: true, name: true, email: true },
				},
			},
		}),
		db.adminActionLog.findMany({
			where: { entityType: "admin_user", entityId: id },
			orderBy: { createdAt: "desc" },
			take: 100,
			select: {
				id: true,
				action: true,
				entityType: true,
				entityId: true,
				beforeValue: true,
				afterValue: true,
				note: true,
				createdAt: true,
				admin: {
					select: { id: true, name: true, email: true },
				},
			},
		}),
	]);

	return {
		user,
		activityByThisAdmin,
		activityOnThisAdmin,
	};
}

export async function inviteAdminUser(
	db: PrismaClient,
	input: InviteAdminUserInput,
): Promise<InviteAdminUserResult> {
	const email = normalizeEmail(input.email);
	if (!email) {
		throw new AdminUserError("bad_input", "Email is required.");
	}
	if (!input.name.trim()) {
		throw new AdminUserError("bad_input", "Name is required.");
	}
	return db.$transaction(async (tx) => {
		await assertActiveSuperAdmin(tx, input.actorProfileId);

		const existingAdmin = await tx.profile.findFirst({
			where: {
				email,
				adminRole: { not: null },
			},
			select: { id: true },
		});
		if (existingAdmin) {
			throw new AdminUserError(
				"conflict",
				"An admin account already exists for this email.",
			);
		}

		const existingPendingInvite = await tx.adminInvitation.findFirst({
			where: { email, status: "pending" },
			select: { id: true },
		});
		if (existingPendingInvite) {
			throw new AdminUserError(
				"conflict",
				"This email already has a pending admin invitation.",
			);
		}

		const now = new Date();
		const profile = await tx.profile.create({
			data: {
				id: input.authUserId,
				facebookId: `fallback_${input.authUserId}`,
				name: input.name.trim(),
				email,
				adminRole: input.role,
				adminIsActive: false,
				adminInvitedById: input.actorProfileId,
				adminInvitedAt: now,
			},
			select: { id: true, email: true, adminRole: true, adminIsActive: true },
		});

		const invite = await tx.adminInvitation.create({
			data: {
				email,
				role: input.role,
				invitedById: input.actorProfileId,
				status: "pending",
			},
			select: { id: true },
		});

		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_invited",
				entityType: "admin_user",
				entityId: profile.id,
				afterValue: {
					email: profile.email,
					role: profile.adminRole,
					adminIsActive: profile.adminIsActive,
				} as object,
			},
		});

		return {
			profileId: profile.id,
			invitationId: invite.id,
		};
	});
}

export async function activateAdminIfNeeded(
	db: PrismaClient,
	input: {
		userId: string;
		email?: string | null | undefined;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		const profile = await tx.profile.findUnique({
			where: { id: input.userId },
			select: {
				id: true,
				email: true,
				adminRole: true,
				adminIsActive: true,
			},
		});
		if (!profile?.adminRole) return;

		const inviteEmail = input.email?.trim().toLowerCase() || profile.email || "";
		let activated = false;
		const now = new Date();

		if (!profile.adminIsActive) {
			await tx.profile.update({
				where: { id: profile.id },
				data: {
					adminIsActive: true,
					adminActivatedAt: now,
					adminDeactivatedAt: null,
					adminDeactivatedById: null,
				},
			});
			activated = true;
		}

		const inviteUpdate = inviteEmail
			? await tx.adminInvitation.updateMany({
					where: {
						email: inviteEmail,
						status: "pending",
					},
					data: {
						status: "accepted",
						acceptedById: profile.id,
						acceptedAt: now,
					},
				})
			: { count: 0 };

		if (activated || inviteUpdate.count > 0) {
			await tx.adminActionLog.create({
				data: {
					adminId: profile.id,
					action: "admin_activated",
					entityType: "admin_user",
					entityId: profile.id,
				},
			});
		}
	});
}

export async function resendAdminInvite(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		targetProfileId: string;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		await assertActiveSuperAdmin(tx, input.actorProfileId);
		const target = await tx.profile.findUnique({
			where: { id: input.targetProfileId },
			select: {
				id: true,
				email: true,
				adminRole: true,
				adminIsActive: true,
			},
		});
		if (!target?.adminRole || !target.email) {
			throw new AdminUserError("not_found", "Admin user not found.");
		}
		if (target.adminIsActive) {
			throw new AdminUserError(
				"bad_state",
				"Cannot resend an invite to an active admin.",
			);
		}

		await tx.adminInvitation.updateMany({
			where: {
				email: target.email,
				status: "pending",
			},
			data: { status: "revoked" },
		});

		await tx.adminInvitation.create({
			data: {
				email: target.email,
				role: target.adminRole,
				invitedById: input.actorProfileId,
				status: "pending",
			},
		});

		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_invite_resent",
				entityType: "admin_user",
				entityId: target.id,
			},
		});
	});
}

export async function deactivateAdminUser(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		targetProfileId: string;
		foundingSuperAdminId?: string | null;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		const { target } = await assertTargetMutationAllowed(tx, {
			actorProfileId: input.actorProfileId,
			targetProfileId: input.targetProfileId,
			foundingSuperAdminId: input.foundingSuperAdminId,
			requireTargetActive: true,
		});
		await assertLastActiveSuperAdminGuard(tx, target.id);

		const before = profileSnapshot(target);
		const now = new Date();
		const updated = await tx.profile.update({
			where: { id: target.id },
			data: {
				adminIsActive: false,
				adminDeactivatedAt: now,
				adminDeactivatedById: input.actorProfileId,
			},
			select: {
				id: true,
				email: true,
				adminRole: true,
				adminIsActive: true,
				adminInvitedAt: true,
				adminActivatedAt: true,
				adminDeactivatedAt: true,
			},
		});

		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_deactivated",
				entityType: "admin_user",
				entityId: target.id,
				beforeValue: before as object,
				afterValue: profileSnapshot(updated) as object,
			},
		});
	});
}

export async function reactivateAdminUser(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		targetProfileId: string;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		const { target } = await assertTargetMutationAllowed(tx, {
			actorProfileId: input.actorProfileId,
			targetProfileId: input.targetProfileId,
		});
		if (target.adminIsActive) {
			throw new AdminUserError("bad_state", "Admin user is already active.");
		}
		if (!target.email) {
			throw new AdminUserError("bad_state", "Admin email is missing.");
		}

		const openInvite = await tx.adminInvitation.findFirst({
			where: {
				email: target.email,
				status: "pending",
			},
			select: { id: true },
		});
		if (openInvite) {
			throw new AdminUserError(
				"bad_state",
				"Cannot reactivate while an invitation is still pending.",
			);
		}

		const before = profileSnapshot(target);
		const now = new Date();
		const updated = await tx.profile.update({
			where: { id: target.id },
			data: {
				adminIsActive: true,
				adminActivatedAt: now,
				adminDeactivatedAt: null,
				adminDeactivatedById: null,
			},
			select: {
				id: true,
				email: true,
				adminRole: true,
				adminIsActive: true,
				adminInvitedAt: true,
				adminActivatedAt: true,
				adminDeactivatedAt: true,
			},
		});

		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_reactivated",
				entityType: "admin_user",
				entityId: target.id,
				beforeValue: before as object,
				afterValue: profileSnapshot(updated) as object,
			},
		});
	});
}

export async function changeAdminRole(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		targetProfileId: string;
		nextRole: AdminRole;
		foundingSuperAdminId?: string | null;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		const { target } = await assertTargetMutationAllowed(tx, {
			actorProfileId: input.actorProfileId,
			targetProfileId: input.targetProfileId,
			foundingSuperAdminId: input.foundingSuperAdminId,
		});
		if (target.adminRole === input.nextRole) {
			throw new AdminUserError("bad_state", "Admin already has this role.");
		}
		if (target.adminRole === "super_admin" && input.nextRole === "admin") {
			await assertLastActiveSuperAdminGuard(tx, target.id);
		}

		const before = profileSnapshot(target);
		const updated = await tx.profile.update({
			where: { id: target.id },
			data: { adminRole: input.nextRole },
			select: {
				id: true,
				email: true,
				adminRole: true,
				adminIsActive: true,
				adminInvitedAt: true,
				adminActivatedAt: true,
				adminDeactivatedAt: true,
			},
		});

		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_role_changed",
				entityType: "admin_user",
				entityId: target.id,
				beforeValue: { adminRole: before.adminRole } as object,
				afterValue: { adminRole: updated.adminRole } as object,
			},
		});
	});
}

export async function logAdminForceSignOut(
	db: PrismaClient,
	input: {
		actorProfileId: string;
		targetProfileId: string;
	},
): Promise<void> {
	await db.$transaction(async (tx) => {
		const { target } = await assertTargetMutationAllowed(tx, {
			actorProfileId: input.actorProfileId,
			targetProfileId: input.targetProfileId,
			requireTargetActive: true,
		});
		await tx.adminActionLog.create({
			data: {
				adminId: input.actorProfileId,
				action: "admin_force_signed_out",
				entityType: "admin_user",
				entityId: target.id,
			},
		});
	});
}
