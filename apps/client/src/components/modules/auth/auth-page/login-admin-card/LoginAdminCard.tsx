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
			className="w-full rounded-xl border border-border bg-bg-surface p-8"
			style={{
				boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
			}}
		>
			<div className="flex flex-col gap-8">
				<header className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold tracking-tight text-text-primary">
						Admin access
					</h2>
					<p className="text-sm leading-relaxed text-text-secondary">
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
