import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAuthBackgroundLayout } from "@/components/modules/login/AdminAuthBackgroundLayout/AdminAuthBackgroundLayout";
import { AdminSetPasswordCard } from "@/components/modules/login/AdminSetPasswordCard/AdminSetPasswordCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Set Password — ROTRA Admin",
};

export default async function SetPasswordPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/login");
	}

	return (
		<AdminAuthBackgroundLayout tagline="Internal platform operations">
			<AdminSetPasswordCard />
		</AdminAuthBackgroundLayout>
	);
}
