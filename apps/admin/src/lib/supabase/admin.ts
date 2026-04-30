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

export async function sendAdminPasswordResetLink(
	email: string,
	redirectTo: string,
): Promise<void> {
	const anonSupabase = createSupabaseAnonClient();
	const { error } = await anonSupabase.auth.resetPasswordForEmail(
		email.trim().toLowerCase(),
		{
			redirectTo,
		},
	);
	if (error) {
		throw new Error(error.message);
	}
}

export async function revokeAdminUserSessions(userId: string): Promise<void> {
	const { url, serviceRoleKey } = supabaseAdminEnv();
	const endpoint = `${url}/auth/v1/admin/users/${userId}/logout`;
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(
			`Failed to revoke sessions: ${body || response.statusText}`,
		);
	}
}
