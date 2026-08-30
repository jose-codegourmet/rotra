import { LoginTesterCardForm } from "./LoginTesterCardForm";

export function LoginTesterCard() {
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
						Sign in
					</h2>
					<p className="text-sm leading-relaxed text-text-secondary">
						Use the email and tester password from your invite email.
					</p>
				</header>
				<LoginTesterCardForm />
			</div>
		</div>
	);
}
