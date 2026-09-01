import { redirect } from "next/navigation";

/** Logged-out visitors land on `/login`. Middleware already sends signed-in users to `/dashboard`. */
export default function HomePage() {
	redirect("/login");
}
