import Link from "next/link";

import { footerContent } from "@/app/constants/coming-soon";
import { Logo } from "@/components/ui/logo/Logo";

export function LandingFooter() {
	const year = new Date().getFullYear();
	return (
		<footer className="border-t border-border bg-bg-base px-4 py-10 md:px-6">
			<div id="footer-docs" className="sr-only" tabIndex={-1}>
				Product changelog and documentation will be linked here at launch.
			</div>
			<div id="footer-support" className="sr-only" tabIndex={-1}>
				Support contact will be published here at launch.
			</div>
			<div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
				<div className="space-y-2">
					<Link
						href="/"
						className="inline-flex items-center h-full py-2"
						aria-label="ROTRA home"
					>
						<Logo variant="dark" className="h-full w-[200px]" />
					</Link>
					<p className="text-micro uppercase tracking-widest text-text-secondary">
						© {year} {footerContent.copyright}
					</p>
				</div>
				<nav aria-label="Footer">
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{footerContent.links.map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="inline-flex min-h-[44px] min-w-[44px] items-center text-label uppercase tracking-wide text-text-primary transition-colors hover:text-accent"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
