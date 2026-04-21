export function DataDeletionContent() {
	return (
		<article className="space-y-8 text-body text-text-primary">
			<header className="space-y-3 border-b border-border pb-8">
				<h1 className="text-display font-bold tracking-tight">
					Data Deletion Instructions
				</h1>
				<p className="text-small text-text-secondary">
					<strong className="font-medium text-text-primary">
						Effective date:
					</strong>{" "}
					April 19, 2026
				</p>
				<p className="rounded-md border border-border bg-bg-surface p-4 text-small text-text-secondary">
					This document is generic boilerplate for ROTRA and does not constitute
					legal advice. Replace placeholders (marked below) and have qualified
					counsel review before relying on it in production.
				</p>
			</header>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					1. Overview
				</h2>
				<p className="text-text-secondary">
					ROTRA (“we”, “us”, “our”) respects your right to request deletion of
					the personal information we hold about you. This page explains what
					data we store, how to request its deletion, and what to expect after
					you submit a request. It supplements our{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="/privacy"
					>
						Privacy Policy
					</a>{" "}
					and satisfies the data deletion instructions requirement described by
					Meta’s{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback"
						rel="noopener noreferrer"
						target="_blank"
					>
						Platform Terms
					</a>
					.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					2. What data we store
				</h2>
				<p className="text-text-secondary">
					When you use the Services, we may store:
				</p>
				<ul className="list-disc space-y-2 pl-5 text-text-secondary">
					<li>
						<strong className="font-medium text-text-primary">
							Account and profile:
						</strong>{" "}
						name, username or display name, profile photo, and email address
						when provided.
					</li>
					<li>
						<strong className="font-medium text-text-primary">
							Authentication identifiers:
						</strong>{" "}
						provider user IDs (for example the Facebook app-scoped user ID, or
						ASID) returned during social sign-in, plus session tokens managed by
						our authentication partner.
					</li>
					<li>
						<strong className="font-medium text-text-primary">
							Activity you create:
						</strong>{" "}
						clubs, sessions, match-related activity, queues, and communications
						submitted through the Services.
					</li>
					<li>
						<strong className="font-medium text-text-primary">
							Service usage and device data:
						</strong>{" "}
						logs, diagnostics, and events needed to secure and improve the
						Services.
					</li>
				</ul>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					3. How to request deletion
				</h2>
				<p className="text-text-secondary">
					You can request deletion of your ROTRA data through any of the
					following channels.
				</p>

				<h3 className="pt-2 text-body font-semibold text-text-primary">
					a. In-app self-service
				</h3>
				<p className="text-text-secondary">
					Sign in to the ROTRA app, open your profile settings, and choose{" "}
					<strong className="font-medium text-text-primary">
						Delete account
					</strong>
					. This removes your account and associated personal data within the
					timeline noted below. If you cannot access the app, use one of the
					other methods.
				</p>

				<h3 className="pt-2 text-body font-semibold text-text-primary">
					b. Email request
				</h3>
				<p className="text-text-secondary">
					Send an email to{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="mailto:jose@codegourmet.io"
					>
						jose@codegourmet.io
					</a>{" "}
					from the address on file with the subject line{" "}
					<em>“Delete my ROTRA data”</em>. Include your username, the email
					associated with your account, and — if you signed in with Facebook —
					your app-scoped user ID (ASID) if you have it. We may ask for
					additional information to verify your identity.
				</p>

				<h3 className="pt-2 text-body font-semibold text-text-primary">
					c. Removing ROTRA from Facebook
				</h3>
				<p className="text-text-secondary">
					If you signed in with Facebook, you can also trigger a deletion
					request by removing the ROTRA app from{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="https://www.facebook.com/settings?tab=applications"
						rel="noopener noreferrer"
						target="_blank"
					>
						facebook.com/settings?tab=applications
					</a>
					. Facebook will notify us of your request and we will delete the
					associated data as described below.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					4. What gets deleted
				</h2>
				<p className="text-text-secondary">
					On a verified request we delete or anonymize:
				</p>
				<ul className="list-disc space-y-2 pl-5 text-text-secondary">
					<li>your account record, profile, and profile photo;</li>
					<li>
						authentication identifiers associated with your account, including
						your Facebook ASID where applicable;
					</li>
					<li>
						content you created that personally identifies you, or we
						pseudonymize it where removal would break shared records (for
						example match history attributable to other participants).
					</li>
				</ul>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					5. What we may retain
				</h2>
				<p className="text-text-secondary">
					Consistent with our Privacy Policy, we may retain limited information
					when we have a legal or legitimate operational need, including:
				</p>
				<ul className="list-disc space-y-2 pl-5 text-text-secondary">
					<li>
						aggregate or de-identified data that can no longer be associated
						with you;
					</li>
					<li>
						records required to comply with legal obligations, resolve
						disputes, or enforce our agreements;
					</li>
					<li>
						security and audit logs needed to detect and prevent fraud or abuse,
						retained for the period permitted by law.
					</li>
				</ul>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					6. Processing timeline
				</h2>
				<p className="text-text-secondary">
					We aim to complete verified deletion requests within{" "}
					<strong className="font-medium text-text-primary">
						[30 days]
					</strong>{" "}
					of receiving them. Backups containing your data are overwritten in
					the normal course of business within{" "}
					<strong className="font-medium text-text-primary">
						[90 days]
					</strong>
					.
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					7. Confirmation and status
				</h2>
				<p className="text-text-secondary">
					When we receive a deletion request — whether directly from you or
					forwarded by Facebook — we respond with a confirmation code and a
					status URL you can use to check the progress of your request. For
					Facebook-initiated requests, this is returned to Meta as required by
					their{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback"
						rel="noopener noreferrer"
						target="_blank"
					>
						data deletion callback specification
					</a>
					.
				</p>
				<p className="text-text-secondary">
					<strong className="font-medium text-text-primary">
						Status URL placeholder:
					</strong>{" "}
					[https://yourdomain.com/data-deletion/status?id=…]
				</p>
			</section>

			<section className="space-y-3">
				<h2 className="text-heading font-semibold text-text-primary">
					8. Contact
				</h2>
				<p className="text-text-secondary">
					<strong className="font-medium text-text-primary">
						Privacy contact:
					</strong>{" "}
					<a
						className="font-medium text-accent underline-offset-2 hover:underline"
						href="mailto:jose@codegourmet.io"
					>
						jose@codegourmet.io
					</a>
				</p>
			</section>
		</article>
	);
}
