import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthSync } from "@/components/providers/AuthSync";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
	title: "ROTRA Admin",
	description: "Internal platform dashboard.",
	robots: { index: false, follow: false },
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
				<ReduxProvider>
					<AuthSync>
						<QueryProvider>
							<ThemeProvider>{children}</ThemeProvider>
						</QueryProvider>
					</AuthSync>
				</ReduxProvider>
			</body>
		</html>
	);
}
