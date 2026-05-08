import { LoginAdminCardForm } from "./LoginAdminCardForm";

type LoginAdminCardProps = {
	gateUnlockedInitially: boolean;
	onSuccess?: (redirectTo: string) => void;
	onError?: (error: unknown) => void;
};

export function LoginAdminCard({
	gateUnlockedInitially,
	onSuccess,
	onError,
}: LoginAdminCardProps) {
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
			<div className="flex flex-col gap-8">
				<header className="flex flex-col gap-2">
					<h2
						className="text-2xl font-bold tracking-tight"
						style={{ color: "#F0F0F2" }}
					>
						Admin access
					</h2>
					<p className="text-sm leading-relaxed" style={{ color: "#9090A0" }}>
						Enter the internal access password, then continue with admin
						credentials.
					</p>
				</header>

				<LoginAdminCardForm
					gateUnlockedInitially={gateUnlockedInitially}
					onSuccess={onSuccess}
					onError={onError}
				/>
			</div>
		</div>
	);
}
