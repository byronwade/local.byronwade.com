"use client";
import "../styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import { ThemeProvider } from "@/context/ThemeContext";
import { BusinessProvider } from "@/context/BuisnessContext";
import { NotificationProvider } from "@/context/NotificationContext";

import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<BusinessProvider>
						<NotificationProvider>
							{children}
							<Toaster />
						</NotificationProvider>
					</BusinessProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
