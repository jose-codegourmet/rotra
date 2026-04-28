import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseEnv(): { url: string; anonKey: string } {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		throw new Error(
			"Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
		);
	}
	return { url, anonKey };
}

export async function createClient() {
	const cookieStore = await cookies();
	const { url, anonKey } = supabaseEnv();

	return createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Called where cookies are immutable; middleware handles refresh.
				}
			},
		},
	});
}
