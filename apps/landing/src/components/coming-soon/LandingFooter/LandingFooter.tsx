import Link from "next/link";

import { footerContent } from "@/app/constants/coming-soon";

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
					<div className="flex items-center gap-2">
						<div className="text-accent">
							<svg
								className="size-6"
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								role="img"
								aria-label="ROTRA mark"
							>
								<title>ROTRA mark</title>
								<path
									d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
									fill="currentColor"
								/>
							</svg>
						</div>
						<span className="font-bold tracking-tight text-text-primary">
							ROTRA
						</span>
					</div>
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
