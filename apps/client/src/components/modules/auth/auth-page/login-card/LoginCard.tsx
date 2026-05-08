import { LoginCardCopyright } from "@/components/modules/auth/auth-page/login-card/LoginCardCopyright";
import { LoginCardForm } from "./LoginCardForm";

export function LoginCard() {
	return (
		<div
			className="w-full"
			style={{
				background: "#1A1A1D",
				border: "1px solid #2A2A2E",
				borderRadius: "20px",
				boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
				padding: "2rem",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
				<header
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					<h2
						className="text-2xl font-bold tracking-tight"
						style={{ color: "#F0F0F2" }}
					>
						Welcome to ROTRA
					</h2>
					<p className="text-sm leading-relaxed" style={{ color: "#9090A0" }}>
						Sign in to access your sessions, player queue, and court activity.
					</p>
				</header>

				<LoginCardForm />

				<LoginCardCopyright />
			</div>
		</div>
	);
}
