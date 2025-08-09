"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange storageKey="thorbis-theme" themes={["dark", "light", "system"]} {...props}>
			{children}
		</NextThemesProvider>
	);
}
