import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@context/ThemeContext";
import { Toaster } from "@components/ui/toaster";
import { cn } from "@utils";

import { AuthProvider } from "@context/AuthContext";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable)}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange storageKey="thorbis-theme">
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
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
