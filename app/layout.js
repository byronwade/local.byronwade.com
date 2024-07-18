"use client";
import "../styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";

import { Userbusinessvider } from "@/context/UserContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { NotificationProvider } from "@/context/NotificationContext";

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
					<Userbusinessvider>
						<BusinessProvider>
							<NotificationProvider>{children}</NotificationProvider>
						</BusinessProvider>
					</Userbusinessvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
