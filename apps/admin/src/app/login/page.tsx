import type { Metadata } from "next";
import { AdminAuthBackgroundLayout } from "@/components/modules/login/AdminAuthBackgroundLayout/AdminAuthBackgroundLayout";
import { AdminLoginCard } from "@/components/modules/login/AdminLoginCard/AdminLoginCard";
import { ROUTES } from "@/constants/admin";

export const metadata: Metadata = {
	title: "Login — ROTRA Admin",
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
	const isForbidden = params.error === "forbidden";

	return (
		<AdminAuthBackgroundLayout tagline="Internal platform operations">
			{isForbidden ? (
				<p className="mb-4 text-small text-danger">
					Your account is authenticated but not allowed to access admin.
				</p>
			) : null}
			<AdminLoginCard nextPath={nextPath} />
		</AdminAuthBackgroundLayout>
	);
}
