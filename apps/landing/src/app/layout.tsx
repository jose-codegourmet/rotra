import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import "./globals.css";

const satoshi = localFont({
	src: [
		{
			path: "../../public/fonts/Satoshi-Variable.woff2",
			weight: "300 900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-VariableItalic.woff2",
			weight: "300 900",
			style: "italic",
		},
	],
	variable: "--font-satoshi",
	display: "swap",
});

export const metadata: Metadata = {
	title: "ROTRA — Coming soon",
	description:
		"The operating system for badminton sessions — fair rotation, live queue state, and history you can trust. Join the waitlist.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn("dark", satoshi.variable)}
			suppressHydrationWarning
		>
			<body className="bg-bg-base text-text-primary antialiased font-sans">
				{children}
				<Toaster position="top-center" duration={4000} />
			</body>
		</html>
	);
}
