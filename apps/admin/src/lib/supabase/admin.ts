import { createClient } from "@supabase/supabase-js";

function supabaseAdminEnv() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !anonKey || !serviceRoleKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY",
		);
	}
	return { url, anonKey, serviceRoleKey };
}

function createSupabaseAdminClient() {
	const { url, serviceRoleKey } = supabaseAdminEnv();
	return createClient(url, serviceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

function createSupabaseAnonClient() {
	const { url, anonKey } = supabaseAdminEnv();
	return createClient(url, anonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	});
}

/**
 * Origin used in password-reset emails (`redirectTo` → `{{ .RedirectTo }}` in the Supabase template).
 * Set `NEXT_PUBLIC_ADMIN_APP_URL` when the public URL differs from `request.url` (e.g. reverse proxy).
 */
export function resolveAdminAppOrigin(request: Request): string {
	const fromEnv = process.env.NEXT_PUBLIC_ADMIN_APP_URL?.trim();
	if (fromEnv) {
		return fromEnv.replace(/\/$/, "");
	}
	return new URL(request.url).origin;
}

export async function inviteAdminAuthUser(input: {
	email: string;
	name: string;
	redirectTo: string;
}): Promise<{ userId: string }> {
	const adminSupabase = createSupabaseAdminClient();
	const email = input.email.trim().toLowerCase();
	const name = input.name.trim();
	const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
		email,
		{
			data: { name },
			redirectTo: input.redirectTo,
		},
	);
	if (error || !data?.user?.id) {
		throw new Error(error?.message ?? "Failed to provision admin auth user.");
	}

	const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
		data.user.id,
		{
			app_metadata: { role: "admin" },
			user_metadata: { name },
		},
	);
	if (updateError) {
		throw new Error(updateError.message);
	}
	return { userId: data.user.id };
}

export async function sendAdminInviteEmail(input: {
	email: string;
	name: string;
	role: "admin" | "super_admin";
	redirectTo: string;
}): Promise<void> {
	const adminSupabase = createSupabaseAdminClient();
	const email = input.email.trim().toLowerCase();
	const name = input.name.trim();
	const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
		email,
		{
			data: { name },
			redirectTo: input.redirectTo,
		},
	);
	if (error) {
		throw new Error(error.message);
	}

	if (!data?.user?.id) return;
	const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
		data.user.id,
		{
			app_metadata: { role: input.role },
			user_metadata: { name },
		},
	);
	if (updateError) {
		throw new Error(updateError.message);
	}
}

export async function sendAdminPasswordResetLink(
	email: string,
	request: Request,
): Promise<void> {
	const anonSupabase = createSupabaseAnonClient();
	const redirectTo = resolveAdminAppOrigin(request);
	const { error } = await anonSupabase.auth.resetPasswordForEmail(
		email.trim().toLowerCase(),
		{ redirectTo },
	);
	if (error) {
		throw new Error(error.message);
	}
}

export async function inviteTesterAuthUser(input: {
	email: string;
	name: string;
	testerPassword: string;
	redirectTo: string;
}): Promise<{ userId: string }> {
	const adminSupabase = createSupabaseAdminClient();
	const email = input.email.trim().toLowerCase();
	const name = input.name.trim();
	const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
		email,
		{
			data: {
				name,
				tester_password: input.testerPassword,
				is_tester: true,
			},
			redirectTo: input.redirectTo,
		},
	);
	if (error || !data?.user?.id) {
		throw new Error(error?.message ?? "Failed to provision tester auth user.");
	}

	return { userId: data.user.id };
}

export async function deleteAdminAuthUser(userId: string): Promise<void> {
	const adminSupabase = createSupabaseAdminClient();
	const { error } = await adminSupabase.auth.admin.deleteUser(userId);
	if (error) {
		throw new Error(error.message);
	}
}
