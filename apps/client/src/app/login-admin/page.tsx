import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginAdminCard } from "@/components/modules/auth/auth-page/login-admin-card/LoginAdminCard";
import { LoginPageFooter } from "@/components/modules/auth/auth-page/login-page-footer/LoginPageFooter";
import DarkVeil from "@/components/ui/dark-veil/DarkVeil";
import { Logo } from "@/components/ui/logo/Logo";
import {
	CLIENT_ADMIN_LOGIN_GATE_COOKIE,
	CLIENT_ADMIN_LOGIN_GATE_COOKIE_VALUE,
} from "@/lib/auth/server";

export const metadata: Metadata = {
	title: "Admin Login — ROTRA",
	robots: { index: false, follow: false },
};

export default async function LoginAdminPage() {
	const cookieStore = await cookies();
	const gateUnlocked =
		cookieStore.get(CLIENT_ADMIN_LOGIN_GATE_COOKIE)?.value ===
		CLIENT_ADMIN_LOGIN_GATE_COOKIE_VALUE;

	return (
		<div className="relative min-h-screen overflow-hidden bg-black">
			<div className="absolute inset-0">
				<DarkVeil speed={1.4} />
			</div>

			<div className="auth-page-overlay absolute inset-0" />

			<div className="pointer-events-none absolute inset-0">
				<div className="auth-page-accent-primary absolute left-1/4 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
				<div className="auth-page-accent-secondary absolute bottom-1/4 right-1/3 h-[320px] w-[320px] rounded-full blur-3xl" />
			</div>

			<main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-12">
				<div className="animate-auth-fade-up mb-8 flex flex-col items-center text-center">
					<Logo variant="dark" className="w-48" />
					<p className="mt-3 text-xs font-medium tracking-[0.2em] text-text-disabled uppercase">
						Admin access
					</p>
				</div>

				<div className="animate-auth-fade-up-delayed w-full max-w-[420px]">
					<LoginAdminCard gateUnlockedInitially={gateUnlocked} />
				</div>
			</main>

			<LoginPageFooter />
		</div>
	);
}
