import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
	title: "ROTRA",
	description: "The badminton session platform.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn("font-sans", geist.variable, satoshi.variable)}
			suppressHydrationWarning
		>
			<body className="bg-bg-base text-text-primary antialiased font-sans">
				<ReduxProvider>
					<QueryProvider>
						<ThemeProvider>
							{children}
							<Toaster position="top-center" duration={4000} />
						</ThemeProvider>
					</QueryProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
