export type AdminUserStatus = "active" | "inactive";

export type AdminUserRow = {
	id: string;
	name: string;
	email: string;
	role: string;
	status: AdminUserStatus;
	lastActive: string;
};

export const MOCK_ADMIN_USERS: AdminUserRow[] = [
	{
		id: "1",
		name: "Ava Chen",
		email: "ava.chen@example.com",
		role: "Admin",
		status: "active",
		lastActive: "2026-04-12",
	},
	{
		id: "2",
		name: "Ben Okoro",
		email: "ben.okoro@example.com",
		role: "Super admin",
		status: "active",
		lastActive: "2026-04-11",
	},
	{
		id: "3",
		name: "Carla Mena",
		email: "carla.mena@example.com",
		role: "Admin",
		status: "inactive",
		lastActive: "2026-03-01",
	},
	{
		id: "4",
		name: "Diego Ruiz",
		email: "diego.ruiz@example.com",
		role: "Admin",
		status: "inactive",
		lastActive: "2026-02-14",
	},
	{
		id: "5",
		name: "Elena Park",
		email: "elena.park@example.com",
		role: "Admin",
		status: "active",
		lastActive: "2026-04-10",
	},
	{
		id: "6",
		name: "Frank Liu",
		email: "frank.liu@example.com",
		role: "Admin",
		status: "active",
		lastActive: "2026-04-09",
	},
];
