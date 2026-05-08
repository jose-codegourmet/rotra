"use client";
import Link from "next/link";

export function LoginCardCopyright() {
	return (
		<footer>
			<p
				className="text-center leading-relaxed"
				style={{ color: "#4A4A55", fontSize: "0.6875rem" }}
			>
				By continuing, you agree to our{" "}
				<Link
					href="/terms"
					className="underline underline-offset-4 text-[#9090A0] transition-colors duration-150 hover:text-[#F0F0F2]"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="underline underline-offset-4 text-[#9090A0] transition-colors duration-150 hover:text-[#F0F0F2]"
				>
					Privacy Policy
				</Link>
				.
			</p>
		</footer>
	);
}
