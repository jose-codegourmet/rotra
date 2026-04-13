import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginCard } from "@/components/modules/login/AdminLoginCard/AdminLoginCard";
import { Logo } from "@/components/ui/logo/Logo";
import { ADMIN_APP_TAGLINE, ROUTES } from "@/constants/admin";

export const metadata: Metadata = {
	title: "Login — ROTRA Admin",
};

export default function LoginPage() {
	return (
		<div className="flex min-h-screen flex-col bg-bg-base">
			<header className="flex justify-end gap-4 px-6 py-4">
				<Link
					href={ROUTES.DASHBOARD}
					className="text-small text-text-secondary underline-offset-4 transition-colors duration-default hover:text-text-primary hover:underline"
				>
					View dashboard layout
				</Link>
				<Link
					href="/"
					className="text-small text-text-secondary underline-offset-4 transition-colors duration-default hover:text-text-primary hover:underline"
				>
					Hub
				</Link>
			</header>

			<main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4">
				<div className="mb-10 flex flex-col items-center text-center">
					<Logo variant="dark" className="h-10 w-40" />
					<p className="mt-3 text-label uppercase tracking-widest text-text-secondary">
						{ADMIN_APP_TAGLINE}
					</p>
				</div>

				<AdminLoginCard />
			</main>
		</div>
	);
}
