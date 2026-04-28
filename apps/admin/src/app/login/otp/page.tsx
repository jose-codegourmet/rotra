import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAuthBackgroundLayout } from "@/components/modules/login/AdminAuthBackgroundLayout/AdminAuthBackgroundLayout";
import { AdminOtpCard } from "@/components/modules/login/AdminOtpCard/AdminOtpCard";
import { ROUTES } from "@/constants/admin";

export const metadata: Metadata = {
	title: "Verify OTP — ROTRA Admin",
};

function getSafeNextPath(rawNext: string | undefined): string {
	if (!rawNext) return ROUTES.DASHBOARD;
	if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
		return ROUTES.DASHBOARD;
	}
	return rawNext;
}

function getSafeEmail(rawEmail: string | undefined): string | null {
	const normalized = rawEmail?.trim().toLowerCase();
	if (!normalized) return null;
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
	return normalized;
}

export default async function LoginOtpPage({
	searchParams,
}: {
	searchParams: Promise<{ email?: string; next?: string }>;
}) {
	const params = await searchParams;
	const nextPath = getSafeNextPath(params.next);
	const email = getSafeEmail(params.email);

	if (!email) {
		redirect(`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}`);
	}

	return (
		<AdminAuthBackgroundLayout tagline="Internal platform operations">
			<AdminOtpCard email={email} nextPath={nextPath} />
		</AdminAuthBackgroundLayout>
	);
}
