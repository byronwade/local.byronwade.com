"use client";
import Header from "@/components/site/Header";

export default function DashboardRootLayout({ children }) {
	return (
		<>
			<Header />
			<div>{children}</div>
		</>
	);
}
