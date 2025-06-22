"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange storageKey="thorbis-theme" {...props}>
			{children}
		</NextThemesProvider>
	);
}
