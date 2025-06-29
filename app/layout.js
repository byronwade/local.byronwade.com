import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@context/ThemeContext";
import { LanguageProvider } from "@context/LanguageContext";
import { Toaster } from "@components/ui/toaster";
import ErrorBoundary from "@components/shared/ErrorBoundary";
import { cn } from "@lib/utils";

import { AuthProvider } from "@context/AuthContext";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn("min-h-screen bg-neutral-950 dark:bg-neutral-950 text-foreground font-sans antialiased", fontSans.variable)}>
				<ErrorBoundary>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange storageKey="thorbis-theme">
						<LanguageProvider initialLocale="en">
							<AuthProvider>
								{children}
								<Toaster />
							</AuthProvider>
						</LanguageProvider>
					</ThemeProvider>
				</ErrorBoundary>
			</body>
		</html>
	);
}

export const viewport = {
	initialScale: 1,
	width: "device-width",
	maximumScale: 1,
	viewportFit: "cover",
};
