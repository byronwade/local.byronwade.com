"use client";

export default function DashboardRootLayout({ children }) {
	return <div className="bg-background text-foreground dark:bg-background dark:text-foreground">{children}</div>;
}
