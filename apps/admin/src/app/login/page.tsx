import type { Metadata } from "next";
import { AdminAuthBackgroundLayout } from "@/components/modules/login/AdminAuthBackgroundLayout/AdminAuthBackgroundLayout";
import { AdminLoginCard } from "@/components/modules/login/AdminLoginCard/AdminLoginCard";
import { ROUTES } from "@/constants/admin";

export const metadata: Metadata = {
	title: "Login — ROTRA Admin",
};

const ERROR_MESSAGES: Record<string, string> = {
	forbidden: "Your account is authenticated but not allowed to access admin.",
	admin_profile_missing:
		"Your account is authenticated, but your admin profile is not provisioned yet.",
	admin_role_missing:
		"Your account is authenticated, but no admin role is assigned yet.",
	admin_inactive:
		"Your admin account is currently inactive. Please contact a Super Admin.",
	auth_unavailable:
		"We could not validate your admin session right now. Please try again.",
};

function getSafeNextPath(rawNext: string | undefined): string {
	if (!rawNext) return ROUTES.DASHBOARD;
	if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
		return ROUTES.DASHBOARD;
	}
	return rawNext;
}

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string; error?: string }>;
}) {
	const params = await searchParams;
	const nextPath = getSafeNextPath(params.next);
	const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

	return (
		<AdminAuthBackgroundLayout tagline="Internal platform operations">
			{errorMessage ? (
				<p className="mb-4 text-small text-danger">{errorMessage}</p>
			) : null}
			<AdminLoginCard nextPath={nextPath} />
		</AdminAuthBackgroundLayout>
	);
}
